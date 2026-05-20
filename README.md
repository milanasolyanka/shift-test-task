## SHIFT-96660

тестовое задание для программы ШИФТ Лаб

сборщик vite 
`npm run dev` - `http://localhost:5173/` 
`npm run preview` - `http://localhost:4173/` 

в процессе разработки заметила, что api возвращает 503 Service has been suspended, через Insomnia у меня достучаться до него тоже не получилось. Поэтому если фронт получает 503, он дает себе моковый ответ от бэка в формате документации из примера. Все моки прописаны в src/app/features/auth/api/authApi.ts
