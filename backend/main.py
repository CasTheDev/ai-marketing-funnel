from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


@app.post("/event")
def create_event(event: Event):

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

    score_result = calculate_lead_score(event.lead_id)

    return {
        "status": "success",
        "message": "Event recorded",
        "lead_score": score_result
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

def calculate_lead_score(lead_id):

    conn = get_connection()
    cur = conn.cursor()

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

    if score < 10:
        status = "Cold Lead"

    elif score < 50:
        status = "Warm Lead"

    else:
        status = "Hot Lead"

    cur.execute("""
        SELECT score_id
        FROM lead_scores
        WHERE lead_id = %s
    """, (lead_id,))

    existing = cur.fetchone()

    if existing:

        cur.execute("""
            UPDATE lead_scores
            SET score = %s,
                status = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE lead_id = %s
        """, (score, status, lead_id))

    else:

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

@app.post("/score/{lead_id}")
def score_lead(lead_id: int):

    return calculate_lead_score(lead_id)

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

@app.get("/dashboard")
def dashboard():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) FROM leads")
    total_leads = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM behavioral_events")
    total_events = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM lead_scores
        WHERE status = 'Cold Lead'
    """)
    cold_leads = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM lead_scores
        WHERE status = 'Warm Lead'
    """)
    warm_leads = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM lead_scores
        WHERE status = 'Hot Lead'
    """)
    hot_leads = cur.fetchone()[0]

    cur.close()
    conn.close()

    return {
        "total_leads": total_leads,
        "total_events": total_events,
        "cold_leads": cold_leads,
        "warm_leads": warm_leads,
        "hot_leads": hot_leads
    }

@app.get("/source-performance")
def source_performance():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT source,
               COUNT(*) as lead_count
        FROM leads
        GROUP BY source
        ORDER BY lead_count DESC
    """)

    rows = cur.fetchall()

    sources = []

    for row in rows:
        sources.append({
            "source": row[0],
            "lead_count": row[1]
        })

    cur.close()
    conn.close()

    return sources

@app.get("/lead-scores")
def get_lead_scores():

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT lead_id,
               score,
               status
        FROM lead_scores
    """)

    rows = cur.fetchall()

    scores = []

    for row in rows:
        scores.append({
            "lead_id": row[0],
            "score": row[1],
            "status": row[2]
        })

    cur.close()
    conn.close()

    return scores