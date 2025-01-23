import uuid

def is_valid_uuid(value):
    try:
        uuid_obj = uuid.UUID(value, version=4)  # Check for a UUID4 (or use version=1, version=3, etc.)
        return str(uuid_obj) == value
    except ValueError:
        return False

def human_readable_size(size_in_bytes):
    # Define the size units
    units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    size = size_in_bytes
    unit_index = 0

    # Loop to divide the size until it's below 1024
    while size >= 1024 and unit_index < len(units) - 1:
        size /= 1024
        unit_index += 1

    return f"{size:.2f} {units[unit_index]}"