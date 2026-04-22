param(
  [int]$IntervalSeconds = 10,
  [string]$Branch = 'main'
)

$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot

function Write-Info($msg) {
  Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
}

Write-Info "Auto-sync started. Watching for changes every $IntervalSeconds second(s). Press Ctrl+C to stop."

while ($true) {
  try {
    $changes = git status --porcelain
    if ($LASTEXITCODE -ne 0) {
      Write-Info 'Git status failed. Retrying...'
      Start-Sleep -Seconds $IntervalSeconds
      continue
    }

    if (-not [string]::IsNullOrWhiteSpace(($changes -join ''))) {
      git add -A
      if ($LASTEXITCODE -ne 0) {
        Write-Info 'git add failed.'
        Start-Sleep -Seconds $IntervalSeconds
        continue
      }

      $message = "Auto update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
      git commit -m $message | Out-Null

      if ($LASTEXITCODE -eq 0) {
        git push origin $Branch
        if ($LASTEXITCODE -eq 0) {
          Write-Info 'Changes pushed successfully.'
        } else {
          Write-Info 'Push failed (check credentials/network).'
        }
      } else {
        Write-Info 'No committable changes.'
      }
    }
  } catch {
    Write-Info "Error: $($_.Exception.Message)"
  }

  Start-Sleep -Seconds $IntervalSeconds
}
