#!/bin/sh
set -eu

pids=""

start_worker() {
  name="$1"
  command="$2"
  echo "Starting ${name}: ${command}"
  sh -c "$command" &
  pids="$pids $!"
}

shutdown() {
  echo "Shutting down AgentFlow AI Engine processes..."
  if [ -n "$pids" ]; then
    kill $pids 2>/dev/null || true
  fi
}

trap shutdown INT TERM

start_worker "planner" "python planner_agent.py"
start_worker "researcher" "python researcher_agent.py"
start_worker "developer" "python developer_agent.py"
start_worker "tester" "python tester_agent.py"
start_worker "reporter" "python reporter_agent.py"

echo "Starting api: python main.py"
python main.py &
api_pid="$!"
pids="$pids $api_pid"

wait "$api_pid"
exit_code="$?"
shutdown
exit "$exit_code"
