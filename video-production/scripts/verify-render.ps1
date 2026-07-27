param(
  [Parameter(Mandatory = $false)]
  [string]$Vertical = "video-production/render/kdo-brand-film-vertical.mp4",
  [Parameter(Mandatory = $false)]
  [string]$Horizontal = "video-production/render/kdo-brand-film-horizontal.mp4"
)

$ErrorActionPreference = "Stop"

function Assert-Render {
  param(
    [string]$Path,
    [int]$Width,
    [int]$Height
  )

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing render: $Path"
  }

  $probe = ffprobe -v error -show_entries `
    stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels `
    -show_entries format=duration `
    -of json -- "$Path" | ConvertFrom-Json

  $video = $probe.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
  $audio = $probe.streams | Where-Object { $_.codec_type -eq "audio" } | Select-Object -First 1
  $duration = [double]$probe.format.duration

  if ($null -eq $video) {
    throw "No video stream: $Path"
  }
  if ($null -eq $audio) {
    throw "No audio stream: $Path"
  }
  if ([int]$video.width -ne $Width -or [int]$video.height -ne $Height) {
    throw "Unexpected resolution $($video.width)x$($video.height): $Path"
  }
  if ($video.r_frame_rate -ne "24/1") {
    throw "Unexpected frame rate $($video.r_frame_rate): $Path"
  }
  if ([math]::Abs($duration - 42) -gt 0.20) {
    throw "Unexpected duration $duration seconds: $Path"
  }
  if ([int]$audio.sample_rate -ne 48000 -or [int]$audio.channels -ne 2) {
    throw "Unexpected audio format $($audio.sample_rate)Hz/$($audio.channels)ch: $Path"
  }

  $blackLog = ffmpeg -hide_banner -nostats -i "$Path" `
    -vf "blackdetect=d=0.45:pix_th=0.015" -an -f null NUL 2>&1
  $blackFrames = $blackLog | Select-String -Pattern "black_start"
  if ($blackFrames) {
    throw "Unexpected sustained black frame detected: $Path"
  }

  Write-Output "PASS render: $Path | $($video.width)x$($video.height) | $([math]::Round($duration, 3))s | $($video.codec_name) + $($audio.codec_name)"
}

Assert-Render -Path $Vertical -Width 1080 -Height 1920
Assert-Render -Path $Horizontal -Width 1920 -Height 1080
