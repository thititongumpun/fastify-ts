npx prisma init --datasource-provider mysql

npx prisma migrate dev --name init

npx prisma db push --preview-feature