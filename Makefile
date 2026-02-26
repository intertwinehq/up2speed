.PHONY: dev dev-tauri build build-tauri deploy clean install typecheck

# Development
dev:
	npm run dev

dev-tauri:
	npm run dev:tauri

# Type checking
typecheck:
	npm run typecheck

# Production builds
build:
	npm run build

build-tauri:
	npm run build:tauri

# Deploy to Vercel
deploy:
	npm run deploy

# Install dependencies
install:
	npm install

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf server/dist/
	rm -rf src-tauri/target/
	rm -rf node_modules/.vite/
