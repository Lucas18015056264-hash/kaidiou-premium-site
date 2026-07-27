param(
  [Parameter(Mandatory = $false)]
  [string]$Output = "public/media/video/kdo-ambient-bed.m4a"
)

$ErrorActionPreference = "Stop"

$parent = Split-Path -Parent $Output
if ($parent) {
  New-Item -ItemType Directory -Force -Path $parent | Out-Null
}

ffmpeg -y -hide_banner -loglevel error `
  -f lavfi -i "anoisesrc=color=brown:amplitude=0.10:duration=42:sample_rate=48000" `
  -f lavfi -i "sine=frequency=48:duration=42:sample_rate=48000" `
  -f lavfi -i "sine=frequency=96:duration=42:sample_rate=48000" `
  -f lavfi -i "sine=frequency=196:duration=42:sample_rate=48000" `
  -filter_complex @"
[0:a]highpass=f=30,lowpass=f=440,volume=0.16,apulsator=mode=sine:hz=0.045:amount=0.18,aformat=channel_layouts=stereo[air];
[1:a]lowpass=f=90,volume=0.048,aformat=channel_layouts=stereo[base];
[2:a]lowpass=f=170,volume=0.018,tremolo=f=0.12:d=0.18,aformat=channel_layouts=stereo[mid];
[3:a]highpass=f=150,lowpass=f=320,volume=0.006,tremolo=f=0.10:d=0.45,aformat=channel_layouts=stereo[texture];
[air][base][mid][texture]amix=inputs=4:normalize=0,
afade=t=in:st=0:d=2.4,
afade=t=out:st=38:d=4,
loudnorm=I=-24:LRA=6:TP=-2.5,
alimiter=limit=0.88[out]
"@ `
  -map "[out]" -ar 48000 -ac 2 -c:a aac -b:a 192k -movflags +faststart -- "$Output"

if ($LASTEXITCODE -ne 0) {
  throw "ffmpeg failed to build the ambient bed"
}

$probe = ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 -- "$Output"
$duration = [double]$probe
if ([math]::Abs($duration - 42) -gt 0.05) {
  throw "Unexpected audio duration: $duration seconds"
}

Write-Output "PASS ambient bed: $([math]::Round($duration, 3))s, 48kHz stereo AAC"
