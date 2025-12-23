use std::path::PathBuf;
use std::time::Duration;

use color_eyre::Result;
use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use ratatui::{
    buffer::Buffer,
    layout::{Constraint, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    symbols::border,
    text::{Line, Span, Text},
    widgets::{Block, Borders, Gauge, Paragraph, Widget, Wrap},
    DefaultTerminal, Frame,
};
use reqwest::multipart;
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
struct MonumentMatch {
    monument: String,
    city: Option<String>,
    country: Option<String>,
    confidence: f64,
}

#[derive(Debug, Deserialize, Clone)]
struct RecognitionResponse {
    monument: String,
    city: Option<String>,
    country: Option<String>,
    confidence: f64,
    top5: Vec<MonumentMatch>,
}

#[derive(Debug, Clone, PartialEq)]
enum AppState {
    Idle,
    Loading,
    Success,
    Error(String),
}

struct App {
    state: AppState,
    selected_file: Option<PathBuf>,
    result: Option<RecognitionResponse>,
    should_quit: bool,
}

impl App {
    fn new() -> Self {
        Self {
            state: AppState::Idle,
            selected_file: None,
            result: None,
            should_quit: false,
        }
    }

    fn run(mut self, mut terminal: DefaultTerminal) -> Result<()> {
        while !self.should_quit {
            terminal.draw(|frame| self.draw(frame))?;
            self.handle_events()?;
        }
        Ok(())
    }

    fn draw(&self, frame: &mut Frame) {
        let layout = Layout::vertical([
            Constraint::Length(3),  // Title
            Constraint::Length(5),  // Instructions
            Constraint::Length(3),  // Selected file
            Constraint::Min(10),    // Results
            Constraint::Length(3),  // Status bar
        ])
        .split(frame.area());

        // Title
        let title_block = Block::default()
            .borders(Borders::ALL)
            .border_set(border::ROUNDED)
            .style(Style::default().fg(Color::Cyan));
        
        let title = Paragraph::new(Text::from(vec![
            Line::from(vec![
                Span::styled("Monument Recognition", Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD)),
                Span::styled(" - Local AI", Style::default().fg(Color::Green)),
            ])
        ]))
        .centered()
        .block(title_block);
        frame.render_widget(title, layout[0]);

        // Instructions
        let instructions_block = Block::default()
            .title(" Controls ")
            .borders(Borders::ALL)
            .border_set(border::ROUNDED)
            .style(Style::default().fg(Color::White));
        
        let instructions = Paragraph::new(Text::from(vec![
            Line::from(vec![
                Span::styled("[O]", Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD)),
                Span::raw(" Open Image  "),
                Span::styled("[R]", Style::default().fg(Color::Green).add_modifier(Modifier::BOLD)),
                Span::raw(" Recognize  "),
                Span::styled("[Q]", Style::default().fg(Color::Red).add_modifier(Modifier::BOLD)),
                Span::raw(" Quit"),
            ]),
        ]))
        .centered()
        .block(instructions_block);
        frame.render_widget(instructions, layout[1]);

        // Selected file
        let file_block = Block::default()
            .title(" Selected Image ")
            .borders(Borders::ALL)
            .border_set(border::ROUNDED)
            .style(Style::default().fg(Color::Blue));
        
        let file_text = match &self.selected_file {
            Some(path) => path.display().to_string(),
            None => "No image selected - Press [O] to open".to_string(),
        };
        let file_para = Paragraph::new(file_text)
            .style(Style::default().fg(Color::White))
            .block(file_block);
        frame.render_widget(file_para, layout[2]);

        // Results area
        let results_block = Block::default()
            .title(" AI Recognition Results ")
            .borders(Borders::ALL)
            .border_set(border::ROUNDED)
            .style(Style::default().fg(Color::Magenta));

        match &self.state {
            AppState::Idle => {
                let idle_text = Paragraph::new(Text::from(vec![
                    Line::from(""),
                    Line::from(Span::styled(
                        "Select an image and press [R] to recognize the monument",
                        Style::default().fg(Color::DarkGray),
                    )),
                    Line::from(""),
                    Line::from(Span::styled(
                        "100% Local AI - Your images never leave your machine",
                        Style::default().fg(Color::Green),
                    )),
                ]))
                .centered()
                .block(results_block);
                frame.render_widget(idle_text, layout[3]);
            }
            AppState::Loading => {
                let loading_text = Paragraph::new(Text::from(vec![
                    Line::from(""),
                    Line::from(Span::styled(
                        "Local AI processing...",
                        Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD),
                    )),
                    Line::from(""),
                    Line::from(Span::styled(
                        "Running CLIP neural network inference locally",
                        Style::default().fg(Color::Cyan),
                    )),
                ]))
                .centered()
                .block(results_block);
                frame.render_widget(loading_text, layout[3]);
            }
            AppState::Success => {
                if let Some(result) = &self.result {
                    let inner = results_block.inner(layout[3]);
                    frame.render_widget(results_block, layout[3]);
                    
                    let results_layout = Layout::vertical([
                        Constraint::Length(2),
                        Constraint::Length(3),
                        Constraint::Min(3),
                    ])
                    .split(inner);

                    // Main result
                    let location = match (&result.city, &result.country) {
                        (Some(city), Some(country)) if !city.is_empty() => format!(", {} ({})", city, country),
                        (Some(city), _) if !city.is_empty() => format!(", {}", city),
                        _ => String::new(),
                    };
                    let main_result = Paragraph::new(Text::from(vec![
                        Line::from(vec![
                            Span::styled("Detected: ", Style::default().fg(Color::White)),
                            Span::styled(
                                format!("{}{}", result.monument, location),
                                Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD),
                            ),
                        ]),
                    ]))
                    .centered();
                    frame.render_widget(main_result, results_layout[0]);

                    // Confidence gauge
                    let confidence_pct = (result.confidence * 100.0) as u16;
                    let gauge = Gauge::default()
                        .block(Block::default().title(" Confidence "))
                        .gauge_style(Style::default().fg(Color::Green))
                        .percent(confidence_pct.min(100))
                        .label(format!("{:.1}%", result.confidence * 100.0));
                    frame.render_widget(gauge, results_layout[1]);

                    // Top 5 results
                    let mut top_lines = vec![Line::from(Span::styled(
                        "Top 5 Matches:",
                        Style::default().fg(Color::Cyan).add_modifier(Modifier::BOLD),
                    ))];
                    for (i, m) in result.top5.iter().take(5).enumerate() {
                        let rank = format!("{}.", i + 1);
                        top_lines.push(Line::from(format!(
                            "{} {} - {:.1}%",
                            rank,
                            m.monument,
                            m.confidence * 100.0
                        )));
                    }
                    let top_para = Paragraph::new(Text::from(top_lines)).centered();
                    frame.render_widget(top_para, results_layout[2]);
                }
            }
            AppState::Error(msg) => {
                let error_text = Paragraph::new(Text::from(vec![
                    Line::from(""),
                    Line::from(Span::styled(
                        "Error",
                        Style::default().fg(Color::Red).add_modifier(Modifier::BOLD),
                    )),
                    Line::from(""),
                    Line::from(Span::styled(msg.as_str(), Style::default().fg(Color::Red))),
                    Line::from(""),
                    Line::from(Span::styled(
                        "Make sure the backend is running: cd backend && ./mvnw quarkus:dev",
                        Style::default().fg(Color::Yellow),
                    )),
                ]))
                .centered()
                .wrap(Wrap { trim: true })
                .block(results_block);
                frame.render_widget(error_text, layout[3]);
            }
        }

        // Status bar
        let status_block = Block::default()
            .borders(Borders::ALL)
            .border_set(border::ROUNDED)
            .style(Style::default().fg(Color::DarkGray));
        
        let status = Paragraph::new(Line::from(vec![
            Span::styled("Local AI", Style::default().fg(Color::Green)),
            Span::raw(" | "),
            Span::styled("Backend: http://localhost:8080", Style::default().fg(Color::Cyan)),
            Span::raw(" | "),
            Span::styled("No cloud. No APIs. 100% Private.", Style::default().fg(Color::Yellow)),
        ]))
        .centered()
        .block(status_block);
        frame.render_widget(status, layout[4]);
    }

    fn handle_events(&mut self) -> Result<()> {
        if event::poll(Duration::from_millis(100))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('q') | KeyCode::Char('Q') => {
                            self.should_quit = true;
                        }
                        KeyCode::Char('o') | KeyCode::Char('O') => {
                            self.open_file_dialog();
                        }
                        KeyCode::Char('r') | KeyCode::Char('R') => {
                            if self.selected_file.is_some() {
                                self.recognize_monument();
                            }
                        }
                        KeyCode::Esc => {
                            self.state = AppState::Idle;
                            self.result = None;
                        }
                        _ => {}
                    }
                }
            }
        }
        Ok(())
    }

    fn open_file_dialog(&mut self) {
        if let Some(path) = rfd::FileDialog::new()
            .add_filter("Images", &["jpg", "jpeg", "png", "gif", "bmp", "webp"])
            .pick_file()
        {
            self.selected_file = Some(path);
            self.state = AppState::Idle;
            self.result = None;
        }
    }

    fn recognize_monument(&mut self) {
        let Some(file_path) = self.selected_file.clone() else {
            return;
        };

        self.state = AppState::Loading;

        // Use blocking runtime for simplicity with TUI
        let rt = tokio::runtime::Runtime::new().unwrap();
        let result = rt.block_on(async {
            let file_bytes = tokio::fs::read(&file_path).await?;
            let file_name = file_path
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .to_string();

            let part = multipart::Part::bytes(file_bytes)
                .file_name(file_name)
                .mime_str("image/jpeg")?;

            let form = multipart::Form::new().part("file", part);

            let client = reqwest::Client::new();
            let response = client
                .post("http://localhost:8080/api/image/recognize")
                .multipart(form)
                .send()
                .await?;

            if response.status().is_success() {
                let result: RecognitionResponse = response.json().await?;
                Ok(result)
            } else {
                Err(color_eyre::eyre::eyre!(
                    "Server returned status: {}",
                    response.status()
                ))
            }
        });

        match result {
            Ok(response) => {
                self.result = Some(response);
                self.state = AppState::Success;
            }
            Err(e) => {
                self.state = AppState::Error(e.to_string());
            }
        }
    }
}

fn main() -> Result<()> {
    color_eyre::install()?;
    let terminal = ratatui::init();
    let result = App::new().run(terminal);
    ratatui::restore();
    result
}
