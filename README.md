# School DMS

### Requirements
- python 3.10.x
- mysql 8.x
- node v.18.19.x


## Backend 

- Copy the **.env.example** contents and paste it in **.env**

### Installation
```bash
pip install -r requirements.txt
```

```bash
python3 manage.py migrate
```

```bash
python3 manage.py runserver
```

### Create superuser or admin (optional)
```bash
python3 manage.py createsuperuser
```


## Frontend Setup
```bash
cd frontend
npm run dev
```