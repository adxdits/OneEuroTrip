(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Cours/E4/al_mounayar-hamani/frontend/app/theme/theme.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/Cours/E4/al_mounayar-hamani/frontend/node_modules/@mui/material/esm/styles/createTheme.js [app-client] (ecmascript) <export default as createTheme>");
'use client';
;
const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    palette: {
        primary: {
            main: '#FF5A5F',
            light: '#FF8E93',
            dark: '#E00007'
        },
        secondary: {
            main: '#00A699',
            light: '#4ECDC4',
            dark: '#008489'
        },
        background: {
            default: '#FFFFFF',
            paper: '#F7F7F7'
        },
        text: {
            primary: '#484848',
            secondary: '#767676'
        },
        divider: '#EBEBEB'
    },
    typography: {
        fontFamily: 'var(--font-plus-jakarta-sans), "Plus Jakarta Sans", "Circular", "Helvetica Neue", Helvetica, Arial, sans-serif',
        h1: {
            fontWeight: 600,
            fontSize: '2.5rem',
            color: '#484848'
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
            color: '#484848'
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.5rem',
            color: '#484848'
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.25rem',
            color: '#484848'
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#484848'
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43,
            color: '#767676'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.18)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }
            }
        }
    }
});
const __TURBOPACK__default__export__ = theme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Cours/E4/al_mounayar-hamani/frontend/app/providers/MUIProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MUIProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Cours/E4/al_mounayar-hamani/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/Cours/E4/al_mounayar-hamani/frontend/node_modules/@mui/material/esm/styles/ThemeProvider.js [app-client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Cours/E4/al_mounayar-hamani/frontend/node_modules/@mui/material/esm/CssBaseline/CssBaseline.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$app$2f$theme$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Cours/E4/al_mounayar-hamani/frontend/app/theme/theme.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function MUIProvider(param) {
    let { children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
        theme: __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$app$2f$theme$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Cours$2f$E4$2f$al_mounayar$2d$hamani$2f$frontend$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CssBaseline$2f$CssBaseline$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Cours/E4/al_mounayar-hamani/frontend/app/providers/MUIProvider.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/Cours/E4/al_mounayar-hamani/frontend/app/providers/MUIProvider.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = MUIProvider;
var _c;
__turbopack_context__.k.register(_c, "MUIProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Cours_E4_al_mounayar-hamani_frontend_app_e5abb910._.js.map