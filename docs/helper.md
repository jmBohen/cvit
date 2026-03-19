# Database Commands

Stop the DB: docker compose stop
Start the DB: docker compose start
Check Logs: docker logs -f local_pg_container
Wipe Data & Reset: docker compose down -v

## How to implement modules

| Step       | Reason                                   |
| ---------- | ---------------------------------------- |
| Entity     | First - DTO and Service depend on it     |
| DTO        | Second - Service uses DTO types          |
| Service    | Third - Controller calls Service methods |
| Controller | Fourth - Needs Service and DTO ready     |
| Module     | Last - Just wires everything together    |
