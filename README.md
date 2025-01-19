# School DMS

### Requirements
- python 3.10.x
- mysql 8.x

### Installation
```bash
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py loaddata fixtures/**.json
```

```bash
python3 manage.py runserver
```