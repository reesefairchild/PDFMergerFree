const { PDFDocument } = PDFLib;

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("pdf1").value = "";
  document.getElementById("pdf2").value = "";
});

document.getElementById("mergeBtn").addEventListener("click", async () => {
  const file1 = document.getElementById("pdf1").files[0];
  const file2 = document.getElementById("pdf2").files[0];

  if (!file1 || !file2) {
    alert("Please input both PDFs.");
    return;
  }

  const pdfBytes1 = await file1.arrayBuffer();
  const pdfBytes2 = await file2.arrayBuffer();

  const pdfDoc1 = await PDFDocument.load(pdfBytes1, {
    ignoreEncryption: true
  });
  const pdfDoc2 = await PDFDocument.load(pdfBytes2, {
    ignoreEncryption: true
  });

  const mergedPdf = await PDFDocument.create();

  const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
  pages1.forEach(page => mergedPdf.addPage(page));

  const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
  pages2.forEach(page => mergedPdf.addPage(page));

  const mergedBytes = await mergedPdf.save();

  downloadPdf(mergedBytes, "mergedPDF.pdf");
});

function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
