phony: all run docker-build

run:
	@npm run dev

docker-build:
	@docker build -f ./Dockerfile-node-builder -t frontend-builder .
	@docker build -f ./Dockerfile-server-builder -t frontend-server-builder .
	@docker build --build-arg base_img=frontend-server-builder --build-arg node_img=frontend-builder -f ./Dockerfile -t slr-frontend .