CREATE TABLE organizations (
    organization_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE organization_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(organization_id),
    user_id UUID NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE leads
ADD COLUMN organization_id UUID;

ALTER TABLE leads
ADD CONSTRAINT fk_leads_organization
FOREIGN KEY (organization_id)
REFERENCES organizations(organization_id);