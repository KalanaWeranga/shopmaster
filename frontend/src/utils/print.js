/**
 * Opens a new browser window with the given HTML content + styles and triggers print.
 * @param {string} htmlContent  - The inner HTML string to print
 * @param {string} title        - Window/document title
 */
export function printContent(htmlContent, title = 'Print') {
  const win = window.open('', '_blank', 'width=800,height=600');
  if (!win) {
    alert('Pop-up blocked! Please allow pop-ups for this site and try again.');
    return;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Courier New', Courier, monospace;
          background: white;
          color: #111;
          padding: 16px;
        }

        /* ── RECEIPT ── */
        .receipt {
          max-width: 320px;
          margin: 0 auto;
          font-size: 12px;
          line-height: 1.6;
        }
        .receipt-title {
          font-size: 18px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 2px;
        }
        .receipt-sub {
          text-align: center;
          font-size: 10px;
          color: #555;
          margin-bottom: 2px;
        }
        .receipt-divider {
          border: none;
          border-top: 1px dashed #aaa;
          margin: 8px 0;
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
        }
        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 15px;
        }
        .receipt-footer {
          text-align: center;
          margin-top: 6px;
          font-size: 10px;
          color: #777;
        }

        /* ── PRICE TAGS ── */
        .tags-page {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 8px;
        }
        .price-tag-card {
          border: 2px solid #222;
          border-radius: 8px;
          padding: 10px 12px;
          text-align: center;
          width: 200px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .price-tag-shop {
          font-size: 9px;
          color: #666;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .price-tag-divider {
          border: none;
          border-top: 1px solid #ccc;
          margin: 4px 0;
        }
        .price-tag-name {
          font-size: 13px;
          font-weight: 800;
          margin: 3px 0;
          word-break: break-word;
        }
        .price-tag-meta {
          font-size: 10px;
          color: #444;
          margin-bottom: 4px;
        }
        .price-tag-cost {
          font-size: 9px;
          color: #888;
          margin-bottom: 2px;
        }
        .price-tag-price {
          font-size: 22px;
          font-weight: 900;
        }
        .price-tag-currency {
          font-size: 13px;
          font-weight: 600;
        }
        .price-tag-barcode {
          margin: 6px auto 2px;
          display: block;
        }
        .price-tag-code {
          font-size: 9px;
          color: #666;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        @media print {
          body { padding: 0; }
          @page { margin: 10mm; }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `);

  win.document.close();

  // Wait for images/SVGs to render then print
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
      win.close();
    }, 500);
  };

  // Fallback if onload doesn't fire
  setTimeout(() => {
    try {
      win.focus();
      win.print();
      win.close();
    } catch (_) {}
  }, 1500);
}