#!/bin/bash

# Test Branch Endpoints Script
# Usage: ./test-branch-endpoints.sh https://iqrab3.skoolific.com

if [ -z "$1" ]; then
  echo "Usage: $0 <branch-url>"
  echo "Example: $0 https://iqrab3.skoolific.com"
  exit 1
fi

BRANCH_URL=$1
echo "Testing endpoints for: $BRANCH_URL"
echo "========================================"
echo ""

# Function to test endpoint
test_endpoint() {
  local endpoint=$1
  local name=$2
  
  echo -n "Testing $name ($endpoint)... "
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BRANCH_URL$endpoint" --max-time 5)
  
  if [ "$response" = "200" ]; then
    echo "✅ OK"
    return 0
  elif [ "$response" = "404" ]; then
    echo "❌ NOT FOUND (404)"
    return 1
  elif [ "$response" = "000" ]; then
    echo "❌ TIMEOUT/CONNECTION ERROR"
    return 1
  else
    echo "⚠️  HTTP $response"
    return 1
  fi
}

# Test all required endpoints
total=0
passed=0

# Critical endpoints
echo "CRITICAL ENDPOINTS:"
echo "-------------------"
test_endpoint "/api/health" "Health Check" && ((passed++))
((total++))

test_endpoint "/api/students/count" "Students Count" && ((passed++))
((total++))

test_endpoint "/api/students/all" "All Students" && ((passed++))
((total++))

test_endpoint "/api/staff/count" "Staff Count" && ((passed++))
((total++))

test_endpoint "/api/staff/all" "All Staff" && ((passed++))
((total++))

test_endpoint "/api/classes/count" "Classes Count" && ((passed++))
((total++))

test_endpoint "/api/classes/all" "All Classes" && ((passed++))
((total++))

echo ""
echo "IMPORTANT ENDPOINTS:"
echo "--------------------"
test_endpoint "/api/finance/summary" "Finance Summary" && ((passed++))
((total++))

test_endpoint "/api/mark-list/summary" "Mark List Summary" && ((passed++))
((total++))

test_endpoint "/api/mark-list/subjects" "Subjects" && ((passed++))
((total++))

echo ""
echo "OPTIONAL ENDPOINTS:"
echo "-------------------"
test_endpoint "/api/evaluations/summary" "Evaluations Summary" && ((passed++))
((total++))

test_endpoint "/api/academic/terms" "Academic Terms" && ((passed++))
((total++))

test_endpoint "/api/attendance/today" "Today's Attendance" && ((passed++))
((total++))

test_endpoint "/api/schedule/all" "Schedule" && ((passed++))
((total++))

test_endpoint "/api/faults/summary" "Faults Summary" && ((passed++))
((total++))

test_endpoint "/api/posts/summary" "Posts Summary" && ((passed++))
((total++))

echo ""
echo "========================================"
echo "RESULTS: $passed/$total endpoints working"
echo ""

if [ $passed -eq $total ]; then
  echo "✅ All endpoints are working! Branch is ready."
  exit 0
elif [ $passed -ge 7 ]; then
  echo "⚠️  Critical endpoints working, but some optional endpoints missing."
  echo "   Branch will work but with limited data."
  exit 0
else
  echo "❌ Critical endpoints missing! Branch needs aggregation routes."
  echo ""
  echo "Next steps:"
  echo "1. Copy BRANCH-AGGREGATION-ROUTES-TEMPLATE.js to branch backend"
  echo "2. Add routes to server.js"
  echo "3. Restart backend"
  echo "4. Run this test again"
  exit 1
fi
