/**
 * Utilities for stripping unwanted inline formatting (fonts, sizes, spacing,
 * colors, backgrounds, Word/Google Docs artifacts) from pasted or stored HTML
 * so all rich text matches Shaula's editorial design system.
 */

const ALLOWED_TEXT_ALIGN = new Set(['left', 'right', 'center', 'justify', 'start', 'end']);

/**
 * Filter a CSS style string, keeping only safe structural alignment (`text-align`)
 * and stripping font, size, spacing, margin, padding, color, and background rules.
 */
function filterInlineStyle(styleValue: string): string {
    if (!styleValue) return '';

    const keptDeclarations: string[] = [];
    const declarations = styleValue.split(';');

    for (const decl of declarations) {
        const colonIndex = decl.indexOf(':');
        if (colonIndex === -1) continue;

        const prop = decl.slice(0, colonIndex).trim().toLowerCase();
        const val = decl.slice(colonIndex + 1).trim().toLowerCase();

        if (prop === 'text-align' && ALLOWED_TEXT_ALIGN.has(val)) {
            keptDeclarations.push(`text-align: ${val}`);
        }
    }

    return keptDeclarations.join('; ');
}

/**
 * Clean an HTML string by removing inline typography, spacing, color, and
 * external document styles while preserving semantic tags (<p>, <strong>, <em>,
 * <ul>, <ol>, <li>, <a>, <blockquote>, <h2>, <h3>, <table>, <img>, etc.).
 */
export function sanitizeRichTextHtml(html?: string | null): string {
    if (!html) return '';

    let cleaned = html
        // Remove blob images
        .replace(/<img[^>]*src=["']blob:[^"']*["'][^>]*>/gi, '')
        // Remove Word / Office XML comments and tags
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<\/?(?:o|w|m|v):[^>]*>/gi, '')
        // Remove <style>, <script>, <meta>, <link> blocks
        .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<(meta|link)[^>]*\/?>/gi, '')
        // Unwrap legacy <font> tags
        .replace(/<\/?font[^>]*>/gi, '');

    if (typeof DOMParser !== 'undefined') {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleaned, 'text/html');
            cleanDomNode(doc.body);
            return doc.body.innerHTML;
        } catch {
            // Fallback to regex cleaning below if DOMParser fails
        }
    }

    return cleaned
        .replace(/\s+(?:class|face|size|color|bgcolor|lang|dir|align)=["'][^"']*["']/gi, '')
        .replace(/\s+style=["']([^"']*)["']/gi, (_match, styleContent: string) => {
            const filtered = filterInlineStyle(styleContent);
            return filtered ? ` style="${filtered}"` : '';
        });
}

/**
 * Clean a DOM subtree in-place (used by DOMParser and TinyMCE paste_postprocess).
 */
export function cleanDomNode(root: HTMLElement): void {
    // Remove disallowed elements completely
    root.querySelectorAll('script, style, meta, link, xml').forEach((el) => el.remove());

    // Unwrap <font> elements
    root.querySelectorAll('font').forEach((fontEl) => {
        const parent = fontEl.parentNode;
        if (parent) {
            while (fontEl.firstChild) {
                parent.insertBefore(fontEl.firstChild, fontEl);
            }
            parent.removeChild(fontEl);
        }
    });

    // Clean attributes on all remaining elements
    root.querySelectorAll('*').forEach((el) => {
        // Remove external classes and legacy presentational attributes
        el.removeAttribute('class');
        el.removeAttribute('id');
        el.removeAttribute('face');
        el.removeAttribute('size');
        el.removeAttribute('color');
        el.removeAttribute('bgcolor');
        el.removeAttribute('lang');

        const styleAttr = el.getAttribute('style');
        if (styleAttr !== null) {
            const filtered = filterInlineStyle(styleAttr);
            if (filtered) {
                el.setAttribute('style', filtered);
            } else {
                el.removeAttribute('style');
            }
        }
    });

    // Unwrap empty <span> tags that have no attributes left
    root.querySelectorAll('span').forEach((spanEl) => {
        if (spanEl.attributes.length === 0 && spanEl.parentNode) {
            const parent = spanEl.parentNode;
            while (spanEl.firstChild) {
                parent.insertBefore(spanEl.firstChild, spanEl);
            }
            parent.removeChild(spanEl);
        }
    });
}

/**
 * Shared TinyMCE configuration options that enforce clean paste and prevent
 * external fonts, sizes, line-heights, margins, and colors from being pasted.
 */
export const tinymceCleanPasteInit = {
    paste_block_drop: true,
    paste_merge_formats: true,
    paste_remove_styles_if_webkit: true,
    paste_webkit_styles: 'none',
    invalid_elements: 'font,script,style,meta,link',
    valid_styles: {
        '*': 'text-align',
    },
    paste_preprocess: (_editor: any, args: { content: string }) => {
        args.content = sanitizeRichTextHtml(args.content);
    },
    paste_postprocess: (_editor: any, args: { node: HTMLElement }) => {
        if (args?.node) {
            cleanDomNode(args.node);
        }
    },
};
