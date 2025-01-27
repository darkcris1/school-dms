# School DMS

### Documentation
- https://docs.google.com/document/d/1o0dtyVSvtMUudNOjREJijiwZUnyfK2d76RKxmd_wYnI/edit?usp=sharing

### Requirements
- python 3.10.x
- mysql 8.x
- node v.18.19.x


## Backend 

- Copy the **.env.example** contents and paste it in **.env**
- Make sure the database configuration is **correct**

### Installation
```bash
python3 -m venv venv
source venv/bin/activate # or in windows venv\Scripts\activate
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
npm i
npm run dev
```