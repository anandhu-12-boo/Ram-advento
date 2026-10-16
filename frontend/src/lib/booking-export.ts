import { strToU8, zipSync } from "fflate";

type ExportBooking = {
  booking_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  tours?: { title?: string; location?: string; duration?: string } | null;
  booking_date?: string;
  time_slot?: string;
  guests?: number;
  vehicle?: string;
  pickup_location?: string;
  special_request?: string;
  total_amount?: number;
  payment_status?: string;
  booking_status?: string;
  created_at?: string;
};

type CellValue = string | number;

const columns = [
  "Booking ID",
  "Customer Name",
  "Email",
  "Phone",
  "Tour",
  "Location",
  "Duration",
  "Date",
  "Time",
  "Guests",
  "Vehicle",
  "Pickup Location",
  "Special Request",
  "Total Amount (INR)",
  "Payment Status",
  "Booking Status",
  "Created At",
];

function xmlEscape(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function columnName(index: number) {
  let name = "";
  for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(((value - 1) % 26) + 65) + name;
  }
  return name;
}

function makeCell(value: CellValue, reference: string) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${reference}"><v>${value}</v></c>`;
  }
  return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(String(value))}</t></is></c>`;
}

/** Downloads an XLSX workbook containing all bookings currently shown in admin. */
export function downloadBookingsSpreadsheet(bookings: ExportBooking[]) {
  const rows: CellValue[][] = [
    columns,
    ...bookings.map((booking) => [
      booking.booking_id ?? "",
      booking.customer_name ?? "",
      booking.customer_email ?? "",
      booking.customer_phone ?? "",
      booking.tours?.title ?? "",
      booking.tours?.location ?? "",
      booking.tours?.duration ?? "",
      booking.booking_date ?? "",
      booking.time_slot ?? "",
      booking.guests ?? "",
      booking.vehicle ?? "",
      booking.pickup_location ?? "",
      booking.special_request ?? "",
      booking.total_amount ?? 0,
      booking.payment_status ?? "",
      booking.booking_status ?? "",
      booking.created_at ?? "",
    ]),
  ];
  const lastColumn = columnName(columns.length - 1);
  const worksheetRows = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => makeCell(value, `${columnName(columnIndex)}${rowIndex + 1}`))
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");
  const files = {
    "[Content_Types].xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        "</Types>",
    ),
    "_rels/.rels": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        "</Relationships>",
    ),
    "xl/workbook.xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<sheets><sheet name="Bookings" sheetId="1" r:id="rId1"/></sheets></workbook>',
    ),
    "xl/_rels/workbook.xml.rels": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
        "</Relationships>",
    ),
    "xl/worksheets/sheet1.xml": strToU8(
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        `<dimension ref="A1:${lastColumn}${rows.length}"/>` +
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
        `<sheetData>${worksheetRows}</sheetData>` +
        `<autoFilter ref="A1:${lastColumn}${rows.length}"/></worksheet>`,
    ),
  };
  const workbook = zipSync(files);
  const blob = new Blob([workbook], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ram-adventure-bookings-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
