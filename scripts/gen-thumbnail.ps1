Add-Type -AssemblyName System.Drawing

# ─── Config ─────────────────────────────────────────────────────────────────
$bgPath     = "C:\Users\Stefan\Desktop\TheCodeMan\Website\website\public\images\images-pool\Goc1.jpg"
$outPath    = "C:\Users\Stefan\Desktop\TheCodeMan\Website\website\public\images\blog\building-mcp-server-in-dotnet.png"
$W = 2000; $H = 1500

# Text content for this specific post
$line1Yellow  = "AI  ·  Performance  ·  MCP"              # yellow bar text
$titleLine1   = "I Built an MCP Server"                   # main white title line 1
$titleLine2   = "That Tests .NET API Performance"         # main white title line 2
$subtitleText = "GitHub Copilot · Load Testing · .NET 10" # smaller white subtitle

# ─── Canvas setup ────────────────────────────────────────────────────────────
$canvas  = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g       = [System.Drawing.Graphics]::FromImage($canvas)
$g.SmoothingMode   = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# ─── Background: scale Goc1.jpg to fill canvas ───────────────────────────────
$bg = [System.Drawing.Image]::FromFile($bgPath)
$bgW = $bg.Width; $bgH = $bg.Height
# Fill scale (cover): find scale so both dimensions are >= canvas
$scale = [Math]::Max($W / $bgW, $H / $bgH)
$scaledW = [int]($bgW * $scale); $scaledH = [int]($bgH * $scale)
$offsetX = [int](($W - $scaledW) / 2); $offsetY = [int](($H - $scaledH) / 2)
$g.DrawImage($bg, $offsetX, $offsetY, $scaledW, $scaledH)
$bg.Dispose()

# ─── Dark overlay ─────────────────────────────────────────────────────────────
$overlayColor = [System.Drawing.Color]::FromArgb(165, 0, 0, 0)  # ~65% black
$overlayBrush = New-Object System.Drawing.SolidBrush($overlayColor)
$g.FillRectangle($overlayBrush, 0, 0, $W, $H)
$overlayBrush.Dispose()

# ─── Helpers ─────────────────────────────────────────────────────────────────
function Draw-CenteredText($graphics, $text, $font, $brush, $y) {
    $size = $graphics.MeasureString($text, $font)
    $x = [int](($W - $size.Width) / 2)
    $graphics.DrawString($text, $font, $brush, [float]$x, [float]$y)
}

# ─── Yellow bar (category / tags) ─────────────────────────────────────────────
# Rectangle background behind yellow text
$barH = 110
$barY = 320
$barColor  = [System.Drawing.Color]::FromArgb(255, 250, 190, 0)    # bright yellow
$barBgColor= [System.Drawing.Color]::FromArgb(30, 255, 190, 0)     # very subtle yellow bg
$barBgBrush = New-Object System.Drawing.SolidBrush($barBgColor)
$g.FillRectangle($barBgBrush, 0, $barY, $W, $barH)
$barBgBrush.Dispose()

$yellowFont  = New-Object System.Drawing.Font("Arial", 62, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$yellowBrush = New-Object System.Drawing.SolidBrush($barColor)
Draw-CenteredText $g $line1Yellow $yellowFont $yellowBrush ([int]($barY + ($barH - 62) / 2 - 8))
$yellowFont.Dispose(); $yellowBrush.Dispose()

# ─── Main title (white, large, 2 lines) ────────────────────────────────────────
$titleFont   = New-Object System.Drawing.Font("Arial", 118, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$whiteBrush  = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)

Draw-CenteredText $g $titleLine1 $titleFont $whiteBrush 540
Draw-CenteredText $g $titleLine2 $titleFont $whiteBrush 680

$titleFont.Dispose()

# ─── Subtitle (white, smaller) ──────────────────────────────────────────────
$subFont = New-Object System.Drawing.Font("Arial", 64, ([System.Drawing.FontStyle]::Regular), [System.Drawing.GraphicsUnit]::Pixel)
$subColor = [System.Drawing.Color]::FromArgb(210, 255, 255, 255)
$subBrush = New-Object System.Drawing.SolidBrush($subColor)
Draw-CenteredText $g $subtitleText $subFont $subBrush 870
$subFont.Dispose(); $subBrush.Dispose()
$whiteBrush.Dispose()

# ─── Thin yellow accent line ─────────────────────────────────────────────────
$accentPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 250, 190, 0), 6)
$g.DrawLine($accentPen, 200, 960, 1800, 960)
$accentPen.Dispose()

# ─── Author / branding (bottom right) ────────────────────────────────────────
$brandFont  = New-Object System.Drawing.Font("Arial", 52, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$brandColor = [System.Drawing.Color]::FromArgb(200, 255, 255, 255)
$brandBrush = New-Object System.Drawing.SolidBrush($brandColor)
$g.DrawString("thecodeman.net", $brandFont, $brandBrush, [float]1340, [float]1380)
$brandFont.Dispose(); $brandBrush.Dispose()

# ─── Save ────────────────────────────────────────────────────────────────────
$g.Dispose()
$canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Dispose()

Write-Host "Saved: $outPath"

