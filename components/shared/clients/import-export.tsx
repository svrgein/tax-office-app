'use client';
import React, { useRef } from 'react';

export function ClientImportExport() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);

    fetch('/api/clients/import', { method: 'POST', body: form })
      .then((r) => r.json())
      .then((j) => alert('Imported: ' + (j.imported ?? '0')))
      .catch((e) => alert(String(e)));
  }

  function onExport() {
    window.location.href = '/api/clients/export';
  }

  return (
    <div className="flex gap-2">
      <input ref={inputRef} type="file" accept=".xls,.xlsx" onChange={onFileChange} />
      <button onClick={onExport} className="btn">Export XLSX</button>
    </div>
  );
}

export default ClientImportExport;
