param(
  [int]$IntervalSeconds = 15,
  [string]$Branch = 'main',
  [switch]$RunSupabase = $true
)

$ErrorActionPreference = 'Continue'
Set-Location -LiteralPath $PSScriptRoot

function Write-Info($msg) {
  Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
}

function Has-GitChanges {
  $status = git status --porcelain
  if ($LASTEXITCODE -ne 0) { return $false }
  return -not [string]::IsNullOrWhiteSpace(($status -join ''))
}

function Push-GitHub([string]$branch) {
  git add -A
  if ($LASTEXITCODE -ne 0) {
    Write-Info 'git add failed.'
    return $false
  }

  $msg = "Auto update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  git commit -m $msg | Out-Null

  if ($LASTEXITCODE -ne 0) {
    Write-Info 'No committable changes.'
    return $false
  }

  git push origin $branch
  if ($LASTEXITCODE -eq 0) {
    Write-Info "GitHub push succeeded on '$branch'."
    return $true
  }

  Write-Info 'GitHub push failed (check network/credentials).'
  return $false
}

function Push-Supabase {
  if (-not $RunSupabase) {
    Write-Info 'Supabase push disabled by flag.'
    return
  }

  $supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
  if (-not $supabaseCmd) {
    Write-Info 'Supabase CLI not found. Install it to enable auto db push.'
    return
  }

  if (-not (Test-Path -LiteralPath "$PSScriptRoot\supabase\migrations")) {
    Write-Info 'No supabase/migrations folder found. Skipping Supabase push.'
    return
  }

  supabase db push
  if ($LASTEXITCODE -eq 0) {
    Write-Info 'Supabase db push succeeded.'
  } else {
    Write-Info 'Supabase db push failed. Ensure you are logged in and project is linked.'
  }
}

Write-Info "Auto Push (GitHub + Supabase) started. Checking every $IntervalSeconds second(s). Press Ctrl+C to stop."
Write-Info "Requires: git auth, Supabase CLI login, and linked Supabase project."

while ($true) {
  try {
    if (Has-GitChanges) {
      $gitPushed = Push-GitHub -branch $Branch
      if ($gitPushed) {
        Push-Supabase
      }
    }
  } catch {
    Write-Info "Error: $($_.Exception.Message)"
  }

  Start-Sleep -Seconds $IntervalSeconds
}
