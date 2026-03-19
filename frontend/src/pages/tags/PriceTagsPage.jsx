import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import JsBarcode from 'jsbarcode';
import { productsAPI } from '../../api';
import { printContent } from '../../utils/print';

const fmt = (n) => `LKR ${parseFloat(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;
const SHOP = process.env.REACT_APP_SHOP_NAME || 'Lumoz';

// Generate barcode SVG string for a product code
function generateBarcodeSVG(code) {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, code, {
      format: 'CODE128',
      width: 1.5,
      height: 40,
      displayValue: false,
      margin: 2,
      background: '#ffffff',
    });
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

// Single price tag card shown in the preview UI
function PriceTagPreview({ product }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && product.code) {
      try {
        JsBarcode(barcodeRef.current, product.code, {
          format: 'CODE128',
          width: 1.4,
          height: 36,
          displayValue: false,
          margin: 2,
          background: 'transparent',
        });
      } catch {}
    }
  }, [product.code]);

  return (
    <div className="price-tag-card" style={{ background: 'white', color: '#111' }}>
      <div className="price-tag-code">{SHOP}</div>
      <div style={{ borderTop: '1px solid #ccc', margin: '4px 0' }} />
      <div className="price-tag-name">{product.name}</div>
      <div className="price-tag-meta">
        {product.size && <span>Size: {product.size}</span>}
        {product.size && product.colors?.[0] && <span> · </span>}
        {product.colors?.[0] && <span>Color: {product.colors[0]}</span>}
      </div>
      <div className="price-tag-price">
        <span className="price-tag-currency">LKR </span>
        {parseFloat(product.selling_price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
      </div>
      <svg ref={barcodeRef} style={{ display: 'block', margin: '6px auto 0', maxWidth: '100%' }} />
      <div className="price-tag-code" style={{ marginTop: 2 }}>{product.code}</div>
    </div>
  );
}

// Build print HTML for all selected tags using canvas-generated barcode images
function buildTagsHTML(products, copies, showSupplierPrice) {
  const tags = products.flatMap(p => Array(copies).fill(p));

  const tagCards = tags.map(p => {
    const barcodeDataUrl = generateBarcodeSVG(p.code);
    const barcodeImg = barcodeDataUrl
      ? `<img src="${barcodeDataUrl}" class="price-tag-barcode" style="max-width:170px;height:44px;" alt="barcode" />`
      : '';

    const metaParts = [];
    if (p.size) metaParts.push(`Size: ${p.size}`);
    if (p.colors?.[0]) metaParts.push(`Color: ${p.colors[0]}`);

    const costLine = showSupplierPrice
      ? `<div class="price-tag-cost">Cost: ${fmt(p.supplier_price)}</div>` : '';

    return `
      <div class="price-tag-card">
        <div class="price-tag-shop">${SHOP}</div>
        <hr class="price-tag-divider" />
        <div class="price-tag-name">${p.name}</div>
        <div class="price-tag-meta">${metaParts.join(' · ')}</div>
        ${costLine}
        <div class="price-tag-price">
          <span class="price-tag-currency">LKR </span>${parseFloat(p.selling_price).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
        </div>
        ${barcodeImg}
        <div class="price-tag-code">${p.code}</div>
      </div>
    `;
  }).join('');

  return `<div class="tags-page">${tagCards}</div>`;
}

export default function PriceTagsPage() {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [showSupplierPrice, setShowSupplierPrice] = useState(false);
  const [copiesPerTag, setCopiesPerTag] = useState(1);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => productsAPI.getAll({ search }).then(r => r.data),
  });

  const handlePrint = () => {
    if (!selected.length) { return; }
    const html = buildTagsHTML(selected, copiesPerTag, showSupplierPrice);
    printContent(html, 'Price Tags');
  };

  const toggleSelect = (product) => {
    setSelected(prev => {
      const exists = prev.find(p => p.id === product.id);
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  const selectAll = () => setSelected([...products]);
  const clearAll = () => setSelected([]);

  const totalTags = selected.length * copiesPerTag;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h2>Price Tags</h2>
          <p>Generate and print product price tags with CODE128 barcodes</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handlePrint}
          disabled={!selected.length}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print {totalTags > 0 ? `${totalTags} Tag${totalTags > 1 ? 's' : ''}` : 'Tags'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        {/* Product selection table */}
        <div>
          {/* Search + actions */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="card-body" style={{ paddingTop: 14, paddingBottom: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="search-wrap" style={{ flex: 1, minWidth: 200 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    className="form-input"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-ghost btn-sm" onClick={selectAll} disabled={!products.length}>
                  Select All
                </button>
                <button className="btn btn-ghost btn-sm" onClick={clearAll} disabled={!selected.length}>
                  Clear
                </button>
                <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                  {selected.length} selected
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="table-wrap">
              {isLoading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : !products.length ? (
                <div className="empty-state"><p>No products found</p></div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          onChange={e => e.target.checked ? selectAll() : clearAll()}
                          checked={selected.length === products.length && products.length > 0}
                          ref={el => { if (el) el.indeterminate = selected.length > 0 && selected.length < products.length; }}
                        />
                      </th>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Size</th>
                      <th>Selling Price</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const isSelected = !!selected.find(s => s.id === p.id);
                      return (
                        <tr
                          key={p.id}
                          onClick={() => toggleSelect(p)}
                          style={{ cursor: 'pointer', background: isSelected ? 'var(--accent-dim)' : '' }}
                        >
                          <td onClick={e => e.stopPropagation()}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(p)} />
                          </td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)' }}>
                              {p.code}
                            </span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{p.name}</td>
                          <td style={{ color: 'var(--text2)' }}>{p.size || '—'}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--green)' }}>
                            {fmt(p.selling_price)}
                          </td>
                          <td>
                            <span className={`badge ${p.quantity === 0 ? 'badge-red' : p.quantity < 5 ? 'badge-yellow' : 'badge-green'}`}>
                              {p.quantity}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Settings + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Print settings */}
          <div className="card">
            <div className="card-header"><div className="card-title">Print Settings</div></div>
            <div className="card-body">
              <div className="form-grid" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Copies Per Tag</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="20"
                    value={copiesPerTag}
                    onChange={e => setCopiesPerTag(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text2)' }}>
                  <input
                    type="checkbox"
                    checked={showSupplierPrice}
                    onChange={e => setShowSupplierPrice(e.target.checked)}
                  />
                  Show supplier / cost price
                </label>
              </div>
              {selected.length > 0 && (
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--accent-dim)', borderRadius: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{totalTags}</span>
                  <span style={{ color: 'var(--text2)' }}> tag{totalTags > 1 ? 's' : ''} will be printed</span>
                  <br />
                  <span style={{ color: 'var(--text3)', fontSize: 11 }}>
                    {selected.length} product{selected.length > 1 ? 's' : ''} × {copiesPerTag} cop{copiesPerTag > 1 ? 'ies' : 'y'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Preview</div>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                {selected.length} product{selected.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="card-body" style={{ background: '#d0d0d0', borderRadius: '0 0 10px 10px', padding: 12, minHeight: 120 }}>
              {selected.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" style={{ width: 32, height: 32 }}>
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <p style={{ color: '#aaa', fontSize: 13 }}>Select products to preview</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {selected.slice(0, 4).map(p => (
                    <PriceTagPreview key={p.id} product={p} />
                  ))}
                  {selected.length > 4 && (
                    <div style={{
                      width: 200, height: 100,
                      background: 'white', border: '2px dashed #ccc',
                      borderRadius: 8, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#aaa', fontSize: 14,
                    }}>
                      +{selected.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* How it works note */}
          <div style={{ padding: '12px 14px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text3)' }}>
            <strong style={{ color: 'var(--text2)' }}>How to print:</strong> Select products above, set copies, then click <strong style={{ color: 'var(--accent)' }}>Print Tags</strong>. A print dialog will open. Choose your printer and paper size.
          </div>
        </div>
      </div>
    </div>
  );
}
