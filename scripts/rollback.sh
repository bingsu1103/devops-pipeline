#!/bin/bash
set -e

# K8s rollback chua duoc su dung trong flow hien tai. Giui lai de sau nay mo rong.
# NAMESPACE="devops-app"
#
# echo "🆘 EMERGENCY ROLLBACK INITIATED!"
#
# 1. Frontend Rollback
# echo "--- Rolling back Frontend Deployment ---"
# kubectl rollout undo deployment/frontend-deployment -n $NAMESPACE
#
# 2. Backend Rollback
# echo "--- Rolling back Backend Deployment ---"
# kubectl rollout undo deployment/backend-deployment -n $NAMESPACE
#
# 3. Trang thai (Monitoring)
# echo "--- Current Deployment Status ---"
# kubectl rollout status deployment/frontend-deployment -n $NAMESPACE
# kubectl rollout status deployment/backend-deployment -n $NAMESPACE
#
# echo "✅ ROLLBACK COMPLETE. System is back to previous stable state."
