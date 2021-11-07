
1. creacion de tabla dynamoDB
aws dynamodb create-table --table-name shopping-car-dev --attribute-definitions AttributeName=user_profile,AttributeType=S  --key-schema AttributeName=user_profile,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --profile dev-personal


2. Desplegar el servicio
serverless deploy --aws-profile dev-personal --envrt dev

3. probar localmente
serverless invoke local --function addItem --aws-profile dev-personal --envrt dev --path data.json

4. remove dynamodb

aws dynamodb delete-table --table-name shopping-car-dev --profile dev-personal

5. remove serverless stack

serverless remove --aws-profile dev-personal --envrt dev

