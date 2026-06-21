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

@app.post("/score/{lead_id}")
def score_lead(lead_id: int):

    conn = get_connection()
    cur = conn.cursor()

    # Get all events for this lead
    cur.execute("""
        SELECT event_type
        FROM behavioral_events
        WHERE lead_id = %s
    """, (lead_id,))

    events = cur.fetchall()

    score = 0

    for event in events:

        if event[0] == "page_view":
            score += 1

        elif event[0] == "pricing_page_view":
            score += 10

        elif event[0] == "ebook_download":
            score += 20

        elif event[0] == "demo_request":
            score += 50

    # Determine status
    if score < 10:
        status = "Cold Lead"

    elif score < 50:
        status = "Warm Lead"

    else:
        status = "Hot Lead"

    # Save score
    cur.execute("""
        INSERT INTO lead_scores
        (lead_id, score, status)
        VALUES (%s, %s, %s)
    """, (lead_id, score, status))

    conn.commit()

    cur.close()
    conn.close()

    return {
        "lead_id": lead_id,
        "score": score,
        "status": status
    }

@app.get("/scores")
def get_scores():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT score_id,
               lead_id,
               score,
               status,
               updated_at
        FROM lead_scores
        ORDER BY score DESC
    """)

    rows = cur.fetchall()

    scores = []

    for row in rows:
        scores.append({
            "score_id": row[0],
            "lead_id": row[1],
            "score": row[2],
            "status": row[3],
            "updated_at": str(row[4])
        })

    cur.close()
    conn.close()

    return scores