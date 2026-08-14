from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from .database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-marketing-funnel.vercel.app",
    ],
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


# =====================================================
# GET ACTIVITY HISTORY FOR A SPECIFIC LEAD
# =====================================================

@app.get(
    "/organizations/{organization_id}/leads/{lead_id}/events"
)
def get_lead_events(
    organization_id: str,
    lead_id: int
):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                be.event_id,
                be.lead_id,
                be.event_type,
                be.created_at
            FROM behavioral_events be
            INNER JOIN leads l
                ON l.lead_id = be.lead_id
            WHERE l.organization_id = %s
              AND be.lead_id = %s
            ORDER BY be.created_at DESC
            """,
            (
                organization_id,
                lead_id
            )
        )

        rows = cur.fetchall()

        events = []

        for row in rows:

            events.append({
                "event_id": row[0],
                "lead_id": row[1],
                "event_type": row[2],
                "created_at": str(row[3])
            })

        return events

    finally:

        cur.close()
        conn.close()


# =====================================================
# CALCULATE LEAD SCORE
# =====================================================

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

@app.get("/organizations/{organization_id}/leads")
def get_organization_leads(organization_id: str):
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
        WHERE organization_id = %s
        ORDER BY lead_id DESC
    """, (organization_id,))

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


@app.get("/organizations/{organization_id}/leads/{lead_id}")
def get_organization_lead(
    organization_id: str,
    lead_id: int
):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            l.lead_id,
            l.email,
            l.first_name,
            l.company_name,
            l.source,
            l.created_at,
            COALESCE(ls.score, 0) AS score,
            COALESCE(ls.status, 'Cold Lead') AS status,
            ls.created_at AS score_created_at
        FROM leads l
        LEFT JOIN LATERAL (
            SELECT
                score,
                status,
                created_at
            FROM lead_scores
            WHERE lead_id = l.lead_id
            ORDER BY created_at DESC
            LIMIT 1
        ) ls ON TRUE
        WHERE l.organization_id = %s
          AND l.lead_id = %s
    """, (organization_id, lead_id))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return {
            "error": "Lead not found"
        }

    return {
        "lead_id": row[0],
        "email": row[1],
        "first_name": row[2],
        "company_name": row[3],
        "source": row[4],
        "created_at": str(row[5]),
        "score": row[6],
        "status": row[7],
        "score_created_at": (
            str(row[8]) if row[8] else None
        ),
    }

@app.get("/dashboard-summary")
def dashboard_summary():

    conn = get_connection()
    cur = conn.cursor()

    # Total Leads
    cur.execute("SELECT COUNT(*) FROM leads")
    total_leads = cur.fetchone()[0]

    # Hot Leads
    cur.execute("""
        SELECT COUNT(*)
        FROM lead_scores
        WHERE status = 'Hot Lead'
    """)
    hot_leads = cur.fetchone()[0]

    # Best Lead Source
    cur.execute("""
        SELECT source,
               COUNT(*) AS total
        FROM leads
        GROUP BY source
        ORDER BY total DESC
        LIMIT 1
    """)

    top_source = cur.fetchone()

    if top_source:
        best_source = top_source[0]
    else:
        best_source = "No Data"

    # Pipeline Health
    if hot_leads >= 5:
        health = "Excellent"

    elif hot_leads >= 2:
        health = "Healthy"

    else:
        health = "Needs Attention"

    # Recommendation
    if best_source == "Google Ads":
        recommendation = (
            "Google Ads is performing well. "
            "Prioritize these leads today."
        )

    elif best_source == "Website":
        recommendation = (
            "Respond to website enquiries within 24 hours."
        )

    else:
        recommendation = (
            "Continue following up with your newest leads."
        )

    cur.close()
    conn.close()

    return {
        "greeting": "Good afternoon, Sandra!",
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "top_source": best_source,
        "pipeline_health": health,
        "recommendation": recommendation
    }
class CasAIRequest(BaseModel):
    organization_id: str
    question: str


@app.post("/cas-ai")
def cas_ai(request: CasAIRequest):

    conn = get_connection()
    cur = conn.cursor()

    # Get all leads belonging to this organization
    cur.execute("""
        SELECT
            l.lead_id,
            l.first_name,
            l.company_name,
            l.email,
            l.source,
            COALESCE(ls.score, 0) AS score,
            COALESCE(ls.status, 'Cold Lead') AS status
        FROM leads l
        LEFT JOIN lead_scores ls
            ON l.lead_id = ls.lead_id
        WHERE l.organization_id = %s
        ORDER BY COALESCE(ls.score, 0) DESC
    """, (request.organization_id,))

    rows = cur.fetchall()

    cur.close()
    conn.close()

    # Prepare lead data
    leads = []

    for row in rows:
        leads.append({
            "lead_id": row[0],
            "first_name": row[1],
            "company_name": row[2],
            "email": row[3],
            "source": row[4],
            "score": row[5],
            "status": row[6],
        })

    question = request.question.lower().strip()

    total_leads = len(leads)

    hot_leads = [
        lead for lead in leads
        if lead["status"] == "Hot Lead"
    ]

    warm_leads = [
        lead for lead in leads
        if lead["status"] == "Warm Lead"
    ]

    cold_leads = [
        lead for lead in leads
        if lead["status"] == "Cold Lead"
    ]

    # --------------------------------------------------
    # WHO SHOULD I FOLLOW UP WITH?
    # --------------------------------------------------

    if (
        "who" in question
        and (
            "follow" in question
            or "contact" in question
            or "call" in question
        )
    ):

        if hot_leads:

            lead = hot_leads[0]

            answer = (
                f"{lead['first_name']} at {lead['company_name']} "
                f"should be your first follow-up. "
                f"They have a lead score of {lead['score']} and are "
                f"classified as a Hot Lead."
            )

        elif warm_leads:

            lead = warm_leads[0]

            answer = (
                f"I recommend following up with {lead['first_name']} "
                f"at {lead['company_name']} first. "
                f"They currently have a score of {lead['score']} "
                f"and are classified as a Warm Lead."
            )

        elif leads:

            lead = leads[0]

            answer = (
                f"Your highest-scoring lead is {lead['first_name']} "
                f"at {lead['company_name']}, with a score of "
                f"{lead['score']}."
            )

        else:

            answer = (
                "You don't have any leads in your CRM yet. "
                "Add some leads and I'll help you prioritise them."
            )

    # --------------------------------------------------
    # WHICH SOURCE PERFORMS BEST?
    # --------------------------------------------------

    elif (
        "source" in question
        or "sources" in question
        or "perform" in question
        or "channel" in question
    ):

        source_counts = {}

        for lead in leads:

            source = lead["source"]

            if source not in source_counts:
                source_counts[source] = 0

            source_counts[source] += 1

        if source_counts:

            sorted_sources = sorted(
                source_counts.items(),
                key=lambda item: item[1],
                reverse=True
            )

            top_source = sorted_sources[0]

            if len(sorted_sources) == 1:

                answer = (
                    f"{top_source[0]} is currently your top lead source "
                    f"with {top_source[1]} lead."
                )

            else:

                tied_sources = [
                    source
                    for source, count in sorted_sources
                    if count == top_source[1]
                ]

                if len(tied_sources) > 1:

                    answer = (
                        f"You currently have a tie between "
                        f"{', '.join(tied_sources)}. "
                        f"Each source has generated "
                        f"{top_source[1]} lead."
                    )

                else:

                    answer = (
                        f"{top_source[0]} is currently your strongest "
                        f"lead source with {top_source[1]} lead"
                        f"{'s' if top_source[1] != 1 else ''}."
                    )

        else:

            answer = (
                "There isn't enough source data yet. "
                "Once leads are added, I'll be able to compare "
                "your acquisition channels."
            )

    # --------------------------------------------------
    # HOW IS MY PIPELINE?
    # --------------------------------------------------

    elif (
        "pipeline" in question
        or "how am i doing" in question
        or "how is my crm" in question
        or "crm health" in question
    ):

        if total_leads == 0:

            answer = (
                "Your CRM doesn't have any leads yet. "
                "Once you start adding leads, I'll analyse "
                "your pipeline health."
            )

        else:

            hot_count = len(hot_leads)
            warm_count = len(warm_leads)
            cold_count = len(cold_leads)

            hot_rate = round(
                (hot_count / total_leads) * 100
            )

            answer = (
                f"Your CRM currently has {total_leads} leads: "
                f"{hot_count} Hot, {warm_count} Warm and "
                f"{cold_count} Cold. "
                f"Your current Hot Lead rate is {hot_rate}%. "
            )

            if hot_count >= 3:

                answer += (
                    "Your pipeline is looking strong, with several "
                    "high-intent prospects ready for follow-up."
                )

            elif hot_count >= 1:

                answer += (
                    "Your pipeline is healthy, but I recommend "
                    "focusing on your Hot Lead first and working "
                    "your Warm Leads toward higher engagement."
                )

            else:

                answer += (
                    "Your pipeline needs attention. "
                    "Focus on increasing engagement with your "
                    "existing leads."
                )

    # --------------------------------------------------
    # GENERAL LEAD QUESTION
    # --------------------------------------------------

    elif (
        "lead" in question
        or "leads" in question
        or "prospect" in question
    ):

        if total_leads == 0:

            answer = (
                "You currently don't have any leads in this CRM."
            )

        else:

            answer = (
                f"You currently have {total_leads} leads: "
                f"{len(hot_leads)} Hot, "
                f"{len(warm_leads)} Warm and "
                f"{len(cold_leads)} Cold."
            )

    # --------------------------------------------------
    # FALLBACK
    # --------------------------------------------------

    else:

        answer = (
            "I can help you analyse your CRM. Try asking me "
            "\"Who should I follow up with?\", "
            "\"Which source performs best?\", or "
            "\"How is my pipeline?\""
        )

    return {
        "success": True,
        "question": request.question,
        "answer": answer,
        "lead_count": total_leads,
        "hot_leads": len(hot_leads),
        "warm_leads": len(warm_leads),
        "cold_leads": len(cold_leads),
    }