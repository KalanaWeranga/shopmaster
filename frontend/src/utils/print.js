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
          gap: 2mm;
          padding: 2mm;
        }
        .price-tag-card {
          border: 0.5px solid #333;
          border-radius: 1mm;
          padding: 1.5mm 2mm;
          text-align: center;
          width: 40mm;
          height: 20mm;
          page-break-inside: avoid;
          break-inside: avoid;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .price-tag-shop {
          font-size: 5px;
          color: #666;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .price-tag-divider {
          border: none;
          border-top: 0.3px solid #ccc;
          margin: 0.8mm 0;
          width: 100%;
        }
        .price-tag-name {
          font-size: 6.5px;
          font-weight: 800;
          margin: 0.3mm 0;
          word-break: break-word;
          line-height: 1.2;
        }
        .price-tag-meta {
          font-size: 5px;
          color: #444;
          margin-bottom: 0.3mm;
          line-height: 1.2;
        }
        .price-tag-cost {
          font-size: 4.5px;
          color: #888;
          margin-bottom: 0.2mm;
        }
        .price-tag-price {
          font-size: 9px;
          font-weight: 900;
          line-height: 1.2;
        }
        .price-tag-currency {
          font-size: 6px;
          font-weight: 600;
        }
        .price-tag-barcode {
          margin: 0.8mm auto 0.2mm;
          display: block;
          max-width: 36mm;
          height: 7mm;
        }
        .price-tag-code {
          font-size: 4px;
          color: #666;
          letter-spacing: 0.3px;
          margin-top: 0.2mm;
          line-height: 1.2;
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