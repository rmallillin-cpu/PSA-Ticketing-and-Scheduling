#!/bin/bash
# Email Management System - Deploy to GitHub & Supabase
# This script automates pushing code to GitHub and deploying to Supabase

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_header() {
    echo -e "\n${YELLOW}======================================${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}======================================${NC}\n"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_status "Git found"
    
    # Check GitHub CLI (optional)
    if command -v gh &> /dev/null; then
        print_status "GitHub CLI found"
    else
        print_warning "GitHub CLI not found (optional, but recommended)"
    fi
    
    # Check Supabase CLI
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not found - Install with: npm install -g supabase"
        exit 1
    fi
    print_status "Supabase CLI found"
    
    # Check for .env.local
    if [ ! -f ".env.local" ]; then
        print_error ".env.local file not found"
        echo "Please create .env.local with your credentials"
        exit 1
    fi
    print_status ".env.local found"
}

# Get Supabase project ID from .env.local
get_project_id() {
    if [ -f ".env.local" ]; then
        SUPABASE_PROJECT_ID=$(grep -i "SUPABASE_URL" .env.local | cut -d '/' -f4 | cut -d '.' -f1)
        if [ -z "$SUPABASE_PROJECT_ID" ]; then
            print_error "Could not extract Supabase project ID from .env.local"
            exit 1
        fi
        print_status "Supabase project ID: $SUPABASE_PROJECT_ID"
    fi
}

# Commit to GitHub
commit_to_github() {
    print_header "Committing to GitHub"
    
    # Add all files
    git add -A
    print_status "Files staged"
    
    # Create commit message
    COMMIT_MESSAGE="[EmailSystem] Update email management system - $(date +'%Y-%m-%d %H:%M:%S')"
    
    # Check if there are changes
    if git diff --cached --quiet; then
        print_warning "No changes to commit"
        return
    fi
    
    # Commit
    git commit -m "$COMMIT_MESSAGE"
    print_status "Committed: $COMMIT_MESSAGE"
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    git push origin main || git push origin master
    print_status "Pushed to GitHub"
}

# Deploy to Supabase
deploy_supabase() {
    print_header "Deploying to Supabase"
    
    # Set Supabase project
    export SUPABASE_PROJECT_ID="$SUPABASE_PROJECT_ID"
    
    print_status "Deploying send-email function..."
    supabase functions deploy send-email --project-id "$SUPABASE_PROJECT_ID"
    print_status "send-email function deployed"
    
    print_status "Deploying retry-failed-email function..."
    supabase functions deploy retry-failed-email --project-id "$SUPABASE_PROJECT_ID"
    print_status "retry-failed-email function deployed"
    
    # Optional: Push database migrations
    read -p "Push database migrations to Supabase? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Pushing migrations..."
        supabase db push --project-id "$SUPABASE_PROJECT_ID"
        print_status "Migrations pushed"
    fi
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    # Check GitHub
    print_status "Checking GitHub status..."
    git log -1 --oneline
    
    # Check Supabase functions
    print_status "Checking Supabase functions..."
    supabase functions list --project-id "$SUPABASE_PROJECT_ID"
}

# Main execution
main() {
    echo -e "${YELLOW}╔════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  Email Management System - Deployment  ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}"
    
    check_prerequisites
    get_project_id
    
    # Ask for confirmation
    echo -e "\nThis will:"
    echo "  1. Commit all changes to GitHub"
    echo "  2. Push to GitHub"
    echo "  3. Deploy Edge Functions to Supabase"
    echo "  4. Verify deployment"
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled"
        exit 1
    fi
    
    commit_to_github
    deploy_supabase
    verify_deployment
    
    print_header "Deployment Complete! ✓"
    echo "Your email management system has been deployed to:"
    echo "  • GitHub: https://github.com/rmallillin-cpu/PSA-Ticketing-and-Scheduling/"
    echo "  • Supabase: https://app.supabase.com/projects/$SUPABASE_PROJECT_ID"
    echo ""
}

# Run main function
main
