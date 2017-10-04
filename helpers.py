import binascii, datetime, hashlib


def create_salt():
    """Returns random salt as a string"""
    m = hashlib.sha256()
    m.update(
        datetime.datetime.now().strftime('%H%M%S%f').encode(encoding="utf-8")
    )
    return m.hexdigest()


def hash_password(password, salt):
    """Returns hash of the password as a string"""
    dk = hashlib.pbkdf2_hmac(
        'sha256', password.encode(encoding="utf-8"),
        salt.encode(encoding="utf-8"), 100000
    )
    return binascii.hexlify(dk).decode("utf-8")

def str_to_set(s):
    """Converts comma-separated string into a set"""
    elems = s.split(',')
    result = set()
    for elem in elems:
        elem = elem.strip()
        if elem:
            result.add(elem)
    return result