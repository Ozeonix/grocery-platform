#!/usr/bin/env bash
# Ozeonix Grocery Platform - Automated API Test Execution Script
# Runs Spring Boot Core API integration tests and checks service contracts.

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "========================================================================"
echo "          OZEONIX GROCERY PLATFORM - AUTOMATED API TEST RUNNER          "
echo "========================================================================"
echo "Root directory: ${ROOT_DIR}"
echo ""

MODE="${1:-all}"

run_core_tests() {
    echo "[1/2] Running Spring Boot Core API Automated Test Suite (JUnit 5 / MockMvc)..."
    cd "${ROOT_DIR}/services/core-api"
    mvn test
    echo "✔ Spring Boot Core API test suite completed successfully."
    echo ""
}

run_live_smoke() {
    echo "[2/2] Running Automated API Contract & Health Suite..."
    node "${SCRIPT_DIR}/test-all-apis.mjs"
}

case "${MODE}" in
    core)
        run_core_tests
        ;;
    live)
        run_live_smoke
        ;;
    all|*)
        run_core_tests
        # If services are running locally, also run live smoke check
        if curl -s -f -m 1 http://localhost:8080/healthz >/dev/null 2>&1; then
            run_live_smoke
        else
            echo "ℹ Note: Local services are not actively running. Skipping live HTTP smoke tests."
            echo "  To run live checks against running containers/servers, run:"
            echo "  ./infrastructure/scripts/test-apis.sh live"
        fi
        ;;
esac

echo "========================================================================"
echo "✔ Automated test run completed."
echo "========================================================================"
