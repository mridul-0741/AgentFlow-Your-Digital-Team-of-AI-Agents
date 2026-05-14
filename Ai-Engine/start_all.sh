#!/bin/sh
set -eu

pids=""
exit_dir="/tmp/agentflow-exits"
mkdir -p "$exit_dir"

shutdown() {
  echo "Shutting down AgentFlow AI Engine processes..."
  if [ -n "$pids" ]; then
    kill $pids 2>/dev/null || true
  fi
}

trap shutdown INT TERM

start_supervised_worker() {
  name="$1"
  script="$2"
  echo "Starting ${name}: python -u ${script}"
  sh -c "python -u ${script}; code=\$?; echo '${name} exited with code '\$code; echo \$code > '${exit_dir}/${name}.exit'; exit \$code" &
  pids="$pids $!"
}

start_supervised_worker "planner" "planner_agent.py"
start_supervised_worker "researcher" "researcher_agent.py"
start_supervised_worker "developer" "developer_agent.py"
start_supervised_worker "tester" "tester_agent.py"
start_supervised_worker "reporter" "reporter_agent.py"

echo "Starting api: python -u main.py"
python -u main.py &
api_pid="$!"
pids="$pids $api_pid"

while kill -0 "$api_pid" 2>/dev/null; do
  for exit_file in "$exit_dir"/*.exit; do
    if [ -f "$exit_file" ]; then
      echo "A worker exited unexpectedly: $exit_file"
      shutdown
      exit 1
    fi
  done
  sleep 2
done

wait "$api_pid" || exit_code="$?"
exit_code="${exit_code:-0}"
shutdown
exit "$exit_code"
