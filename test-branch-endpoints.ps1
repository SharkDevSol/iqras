# Test Branch Endpoints Script (PowerShell)
# Usage: .\test-branch-endpoints.ps1 https://iqrab3.skoolific.com

param(
    [Parameter(Mandatory=$true)]
    [string]$BranchUrl
)

Write-Host "Testing endpoints for: $BranchUrl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$total = 0
$passed = 0

function Test-Endpoint {
    param(
        [string]$Endpoint,
        [string]$Name
    )
    
    Write-Host -NoNewline "Testing $Name ($Endpoint)... "
    
    try {
        $response = Invoke-WebRequest -Uri "$BranchUrl$Endpoint" -Method Get -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "⚠️  HTTP $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        if ($_.Exception.Response.StatusCode.Value__ -eq 404) {
            Write-Host "❌ NOT FOUND (404)" -ForegroundColor Red
        } else {
            Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

# Critical endpoints
Write-Host "CRITICAL ENDPOINTS:" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
$total++; if (Test-Endpoint "/api/health" "Health Check") { $passed++ }
$total++; if (Test-Endpoint "/api/students/count" "Students Count") { $passed++ }
$total++; if (Test-Endpoint "/api/students/all" "All Students") { $passed++ }
$total++; if (Test-Endpoint "/api/staff/count" "Staff Count") { $passed++ }
$total++; if (Test-Endpoint "/api/staff/all" "All Staff") { $passed++ }
$total++; if (Test-Endpoint "/api/classes/count" "Classes Count") { $passed++ }
$total++; if (Test-Endpoint "/api/classes/all" "All Classes") { $passed++ }

Write-Host ""
Write-Host "IMPORTANT ENDPOINTS:" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow
$total++; if (Test-Endpoint "/api/finance/summary" "Finance Summary") { $passed++ }
$total++; if (Test-Endpoint "/api/mark-list/summary" "Mark List Summary") { $passed++ }
$total++; if (Test-Endpoint "/api/mark-list/subjects" "Subjects") { $passed++ }

Write-Host ""
Write-Host "OPTIONAL ENDPOINTS:" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow
$total++; if (Test-Endpoint "/api/evaluations/summary" "Evaluations Summary") { $passed++ }
$total++; if (Test-Endpoint "/api/academic/terms" "Academic Terms") { $passed++ }
$total++; if (Test-Endpoint "/api/attendance/today" "Today's Attendance") { $passed++ }
$total++; if (Test-Endpoint "/api/schedule/all" "Schedule") { $passed++ }
$total++; if (Test-Endpoint "/api/faults/summary" "Faults Summary") { $passed++ }
$total++; if (Test-Endpoint "/api/posts/summary" "Posts Summary") { $passed++ }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULTS: $passed/$total endpoints working" -ForegroundColor Cyan
Write-Host ""

if ($passed -eq $total) {
    Write-Host "✅ All endpoints are working! Branch is ready." -ForegroundColor Green
    exit 0
} elseif ($passed -ge 7) {
    Write-Host "⚠️  Critical endpoints working, but some optional endpoints missing." -ForegroundColor Yellow
    Write-Host "   Branch will work but with limited data." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ Critical endpoints missing! Branch needs aggregation routes." -ForegroundColor Red
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Copy BRANCH-AGGREGATION-ROUTES-TEMPLATE.js to branch backend"
    Write-Host "2. Add routes to server.js"
    Write-Host "3. Restart backend"
    Write-Host "4. Run this test again"
    exit 1
}
