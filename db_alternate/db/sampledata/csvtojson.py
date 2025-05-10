from random import randint
import json
import sys
import csv
import os

# AUTHOR_LINE = f"INSERT INTO authors (name) values ('{author}');"
# CATEGORY_LINE = f"INSERT INTO categories (name) values ('{category}');"
# PUBLISHER_LINE = f"INSERT INTO publishers (name) values ('{publisher}');"
# BOOK_LINE = (
#     f"INSERT INTO books (title,year,pages) values ({title},{year},{pages});"
# )


def main(argv):
    for arg in argv[1:]:
        print(arg)
        name, ext = os.path.splitext(os.path.abspath(arg))
        print(name)
        with open(f"{name}.json", "w") as f:
            data = json.dumps(list(gen_rows(arg)))
            f.write(data)


def gen_rows(csvfile):
    with open(csvfile) as f:
        f_csv = csv.reader(f, delimiter=",")
        headings = next(f_csv)
        for r in f_csv:
            row = dict(zip(headings, r))
            row["year"] = randint(1920, 2020)
            yield row


def dump_rows(rowsgen):
    return json.dumps(list(rowsgen))


if __name__ == "__main__":
    main(sys.argv)
