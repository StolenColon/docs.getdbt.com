import subprocess
import re
import pandas as pd

# List of dbt commands to check
dbt_commands = [
    "build", "clean", "compile", "debug", "deps", "docs generate", "docs serve",
    "init", "list", "parse", "run", "retry", "clone", "run-operation",
    "seed", "snapshot", "source freshness", "test", "show"
]

# Function to get flags for a command
def get_flags(command):
    try:
        # Run the command with --help
        result = subprocess.run(
            f"dbt {command} --help", shell=True, text=True, capture_output=True
        )
        if result.returncode != 0:
            print(f"Error running `dbt {command} --help`: {result.stderr}")
            return []

        # Extract flags from the help output
        flags = re.findall(r"--([\w-]+)", result.stdout)
        return flags
    except Exception as e:
        print(f"Error processing command `{command}`: {e}")
        return []

# Gather all flags for all commands
command_flags = {}
for command in dbt_commands:
    print(f"Checking flags for: dbt {command}...")
    flags = get_flags(command)
    command_flags[command] = flags

# Create a DataFrame for better visualization
data = []
for command, flags in command_flags.items():
    data.append({"Command": command, "Supported Flags": ", ".join(flags)})

df = pd.DataFrame(data)

# Save the table as a CSV file
output_file = "dbt_command_flags.csv"
df.to_csv(output_file, index=False)
print(f"Table saved to {output_file}")

# Display the table
print(df)
