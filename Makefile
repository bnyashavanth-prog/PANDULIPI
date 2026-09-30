.PHONY: dev

dev:
	@echo "Starting Pandulipi in DEV mode (HW_MODE=mock)"
	@start "Backend API" cmd /c "cd apps\api && ..\..\venv\Scripts\activate && set HW_MODE=mock && uvicorn main:app --reload --port 8000"
	@start "Frontend Kiosk" cmd /c "cd apps\kiosk && npm run dev"
