import modules.db as db

def drop_db():
    db.cur.execute("""
                DROP TABLE IF EXISTS uo_bridge;
                DROP TABLE IF EXISTS pou_bridge;
                DROP TABLE IF EXISTS users;
                DROP TABLE IF EXISTS organisations;
                DROP TABLE IF EXISTS posts;
    """)

    db.conn.commit()