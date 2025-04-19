import { RiFileChartLine } from 'react-icons/ri'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

function GenerateReport({ userAccess, formulation }) {
  const handleGenerateReport = async () => {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    // Embed fonts for better typography
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)

    let page = pdfDoc.addPage([595.28, 841.89]) // A4 size
    const { width, height } = page.getSize()

    // Define colors
    const primaryColor = rgb(0.54296875, 0.26953125, 0.07421875) // Brown
    const secondaryColor = rgb(0.1, 0.4, 0.7) // Blue for section headers
    const textColor = rgb(0.2, 0.2, 0.2)
    const lightGray = rgb(0.9, 0.9, 0.9)

    // Define spacing and sizing
    const margin = 50
    // const contentWidth = width - (margin * 2)
    const titleFontSize = 20
    const headerFontSize = 14
    const subheaderFontSize = 12
    const bodyFontSize = 10
    const smallFontSize = 9
    const lineHeight = 18

    // Add logo image instead of placeholder rectangle
    try {
      // Fetch the logo image
      const logoResponse = await fetch('/assets/logo.png')
      const logoImageData = await logoResponse.arrayBuffer()

      // Embed the image in the PDF
      const logoImage = await pdfDoc.embedPng(logoImageData)
      const logoDims = logoImage.scale(0.075)

      // Draw the logo
      page.drawImage(logoImage, {
        x: margin,
        y: height - margin - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      })
    } catch (error) {
      console.error('Error adding logo:', error)

      // Fallback to rectangle if image loading fails
      page.drawRectangle({
        x: margin,
        y: height - margin - 40,
        width: 30,
        height: 30,
        color: primaryColor,
      })
    }

    // Add company name beside logo
    page.drawText('SAPAT', {
      x: margin + 40,
      y: height - margin - 25,
      size: 16,
      font: timesRomanBold,
      color: primaryColor,
    })

    // Add report generation date
    const today = new Date()
    const formattedDate = today
      .toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      })
      .replace(/\//g, '/')

    page.drawText(`Report generated on: ${formattedDate}`, {
      x: width - margin - 180,
      y: height - margin - 25,
      size: smallFontSize,
      font: helvetica,
      color: textColor,
    })

    // Add horizontal rule
    page.drawLine({
      start: { x: margin, y: height - margin - 50 },
      end: { x: width - margin, y: height - margin - 50 },
      thickness: 1,
      color: lightGray,
    })

    // Report Title
    let yPosition = height - margin - 80
    page.drawText(`Feed Formulation Report`, {
      x: margin,
      y: yPosition,
      size: titleFontSize,
      font: timesRomanBold,
      color: primaryColor,
    })

    // Formulation Details Section
    yPosition -= 40
    page.drawText(`Formulation Details`, {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    // Draw info fields with clear alignment
    yPosition -= 25
    const labelX = margin
    const detailX = margin + 120
    const fieldSpacing = 18

    const fieldData = [
      { label: 'Code:', value: formulation.code },
      { label: 'Name:', value: formulation.name },
      { label: 'Description:', value: formulation.description },
      { label: 'Animal Group:', value: formulation.animal_group },
      { label: 'Total Cost:', value: `PHP ${formulation.cost} per 100kg` },
    ]

    fieldData.forEach((field) => {
      page.drawText(field.label, {
        x: labelX,
        y: yPosition,
        size: subheaderFontSize,
        font: timesRomanBold,
        color: textColor,
      })

      page.drawText(field.value, {
        x: detailX,
        y: yPosition,
        size: subheaderFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      yPosition -= fieldSpacing
    })

    // Ingredients Section
    yPosition -= 15
    page.drawText(`Ingredients (Ratio for 100 kg)`, {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    yPosition -= 25

    // Draw ingredients table with proper column alignment
    const nameColWidth = 180
    const minColWidth = 50
    const maxColWidth = 50
    const valColWidth = 50

    // Column positions
    const nameX = margin
    const minX = nameX + nameColWidth
    const maxX = minX + minColWidth
    const valX = maxX + maxColWidth

    // Draw header
    page.drawText('Ingredient Name', {
      x: nameX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Min', {
      x: minX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Max', {
      x: maxX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Value', {
      x: valX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    yPosition -= 15

    // Draw a line under headers
    page.drawLine({
      start: { x: margin, y: yPosition + 5 },
      end: {
        x: margin + nameColWidth + minColWidth + maxColWidth + valColWidth,
        y: yPosition + 5,
      },
      thickness: 0.5,
      color: lightGray,
    })

    yPosition -= 5

    // Draw ingredients rows
    formulation.ingredients.forEach((ing) => {
      page.drawText(ing.name, {
        x: nameX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(ing.minimum?.toString() || 'N/A', {
        x: minX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(ing.maximum.toString() || 'N/A', {
        x: maxX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(ing.value.toString(), {
        x: valX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      yPosition -= lineHeight

      // Check if we need a new page
      if (yPosition < margin + 100) {
        page = pdfDoc.addPage([595.28, 841.89])
        yPosition = height - margin - 50
      }
    })

    // Nutrients Section
    yPosition -= 15
    page.drawText(`Nutrients`, {
      x: margin,
      y: yPosition,
      size: headerFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    yPosition -= 25

    // Draw nutrients table headers
    page.drawText('Nutrient', {
      x: nameX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Min', {
      x: minX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Max', {
      x: maxX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    page.drawText('Value', {
      x: valX,
      y: yPosition,
      size: subheaderFontSize,
      font: timesRomanBold,
      color: secondaryColor,
    })

    yPosition -= 15

    // Draw a line under headers
    page.drawLine({
      start: { x: margin, y: yPosition + 5 },
      end: {
        x: margin + nameColWidth + minColWidth + maxColWidth + valColWidth,
        y: yPosition + 5,
      },
      thickness: 0.5,
      color: lightGray,
    })

    yPosition -= 5

    // Draw nutrients rows
    formulation.nutrients.forEach((nutrient) => {
      page.drawText(nutrient.name, {
        x: nameX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(nutrient.minimum.toString() || 'N/A', {
        x: minX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(nutrient.maximum.toString() || 'N/A', {
        x: maxX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      page.drawText(nutrient.value.toString(), {
        x: valX,
        y: yPosition,
        size: bodyFontSize,
        font: timesRomanFont,
        color: textColor,
      })

      yPosition -= lineHeight

      // Check if we need a new page
      if (yPosition < margin + 100) {
        page = pdfDoc.addPage([595.28, 841.89])
        yPosition = height - margin - 50
      }
    })

    // Add footer with page number
    const totalPages = pdfDoc.getPageCount()
    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i)
      // const { height } = page.getSize();

      page.drawText(`Page ${i + 1} of ${totalPages}`, {
        x: width / 2 - 40,
        y: margin / 2,
        size: smallFontSize,
        font: helvetica,
        color: textColor,
      })

      // Add footer divider
      page.drawLine({
        start: { x: margin, y: margin },
        end: { x: width - margin, y: margin },
        thickness: 0.5,
        color: lightGray,
      })
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // Create a Blob from the PDF bytes
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })

    // Create a download link and trigger the download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(pdfBlob)
    link.download = `${formulation.name} - Feed Formulation Report.pdf`
    link.click()
  }

  return (
    <button
      disabled={userAccess === 'view'}
      className="btn btn-warning gap-2 rounded-lg"
      onClick={handleGenerateReport}
    >
      <RiFileChartLine /> Generate report
    </button>
  )
}

export default GenerateReport
