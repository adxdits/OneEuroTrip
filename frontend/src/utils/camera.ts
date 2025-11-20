const camera = function () {
  let width = 0;
  let height = 0;

  return {
    video: null as HTMLVideoElement | null,
    context: null as CanvasRenderingContext2D | null,
    canvas: null as HTMLCanvasElement | null,
    stream: null as MediaStream | null,

    startCamera: function (videoElement: HTMLVideoElement, w = 680, h = 480) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        width = w;
        height = h;

        // Create canvas for capturing snapshots
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'none';
        document.body.appendChild(canvas);

        this.video = videoElement;
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');

        return new Promise<void>((resolve, reject) => {
          navigator.mediaDevices
            .getUserMedia({ 
              video: { 
                facingMode: 'environment',
                width: { ideal: width },
                height: { ideal: height }
              } 
            })
            .then((stream) => {
              if (this.video) {
                this.stream = stream;
                this.video.srcObject = stream;
                resolve();
              } else {
                reject(new Error('Video element not available'));
              }
            })
            .catch(() => {
              navigator.mediaDevices
                .getUserMedia({ 
                  video: {
                    width: { ideal: width },
                    height: { ideal: height }
                  }
                })
                .then((stream) => {
                  if (this.video) {
                    this.stream = stream;
                    this.video.srcObject = stream;
                    resolve();
                  } else {
                    reject(new Error('Video element not available'));
                  }
                })
                .catch((fallbackError) => {
                  reject(fallbackError);
                });
            });
        });
      } else {
        return Promise.reject(new Error('Camera not supported'));
      }
    },

    takeSnapshot: function (): string | null {
      if (this.context && this.video && this.canvas) {
        // Draw the video frame to canvas
        this.context.drawImage(this.video, 0, 0, width, height);
        return this.canvas.toDataURL('image/png');
      }
      return null;
    },

    stopCamera: function () {
      if (this.stream) {
        this.stream.getTracks().forEach((track) => track.stop());
      }
      if (this.video) {
        this.video.srcObject = null;
      }
      if (this.canvas) {
        this.canvas.remove();
      }
      this.video = null;
      this.canvas = null;
      this.context = null;
      this.stream = null;
    },
  };
}();

export default camera;
