from fastapi import FastAPI
from pydantic import BaseModel
from backend.database import get_connection

app = FastAPI()

class Lead(BaseModel):
    email: str
    first_name: str
    company_name: str
    source: str

class Event(BaseModel):
    lead_id: int
    event_type: str

@app.get("/")
def home():
    return {"status": "API Running"}

@app.get("/leads")
def get_leads():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT lead_id,
               email,
               first_name,
               company_name,
               source,
               created_at
        FROM leads
        ORDER BY lead_id DESC
    """)

    rows = cur.fetchall()

    leads = []

    for row in rows:
        leads.append({
            "lead_id": row[0],
            "email": row[1],
            "first_name": row[2],
            "company_name": row[3],
            "source": row[4],
            "created_at": str(row[5])
        })

    cur.close()
    conn.close()

    return leads

@app.get("/leads")
def get_leads():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT lead_id,
               email,
               first_name,
               company_name,
               source,
               created_at
        FROM leads
        ORDER BY lead_id DESC
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return rows
    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO leads
        (email, first_name, company_name, source)
        VALUES (%s, %s, %s, %s)
        """,
        (
            lead.email,
            lead.first_name,
            lead.company_name,
            lead.source
        )
    )

    conn.commit()

    cur.close()
    conn.close()

    return {
        "status": "success",
        "message": "Lead created"
    }

@app.post("/event")
def create_event(event: Event):

    try:

        conn = get_connection()
        cur = conn.cursor()

        cur.execute(
            """
            INSERT INTO behavioral_events
            (lead_id, event_type)
            VALUES (%s, %s)
            """,
            (
                event.lead_id,
                event.event_type
            )
        )

        conn.commit()

        cur.close()
        conn.close()

        return {
            "status": "success",
            "message": "Event recorded"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
@app.get("/events")
def get_events():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT event_id,
               lead_id,
               event_type,
               created_at
        FROM behavioral_events
        ORDER BY event_id DESC
    """)

    rows = cur.fetchall()

    events = []

    for row in rows:
        events.append({
            "event_id": row[0],
            "lead_id": row[1],
            "event_type": row[2],
            "created_at": str(row[3])
        })

    cur.close()
    conn.close()

    return events