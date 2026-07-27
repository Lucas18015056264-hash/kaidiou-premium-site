param(
  [Parameter(Mandatory = $false)]
  [string]$Path = "public/media/video/ai-material-flow.mp4"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path)) {
  throw "Missing generated media: $Path"
}

$probe = ffprobe -v error -show_entries `
  stream=codec_type,width,height,r_frame_rate `
  -show_entries format=duration `
  -of json -- "$Path" | ConvertFrom-Json

$video = $probe.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
$duration = [double]$probe.format.duration

if ($null -eq $video) {
  throw "No video stream found in $Path"
}
if ($duration -lt 6 -or $duration -gt 8.5) {
  throw "Unexpected duration $duration seconds; expected 6-8.5 seconds"
}
if ([int]$video.width -lt 1280 -or [int]$video.height -lt 720) {
  throw "Resolution $($video.width)x$($video.height) is below 1280x720"
}

Write-Output "PASS generated media: $($video.width)x$($video.height), $([math]::Round($duration, 2))s, $($video.r_frame_rate)"
