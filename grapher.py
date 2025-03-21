import os
import re
def extract_imports(file_path):
    """Extracts import statements from a given file and returns a list of (fromfilename, components, tofilename)."""
    imports = []
    tofilename = os.path.basename(file_path).replace('@', '').rsplit('.', 1)[0]
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        for line in file:
            match_a = re.match(r"^\s*import\s+([^\{]+?)\s+from\s+['\"]([^'\"]+)['\"]", line)
            match_b = re.match(r"^\s*import\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"]", line)
            match_c = re.match(r"^\s*const\s+\w+\s*=\s*require\(['\"]([^'\"]+)['\"]\)", line)
            
            if match_a:
                fromfilename = match_a.group(2).strip()
                if not fromfilename.startswith(('.', '/')):
                    continue  # Skip module/package imports
                fromfilename = os.path.basename(fromfilename.replace('@', '')).rsplit('.', 1)[0]
                component = match_a.group(1).strip()
                imports.append((fromfilename, component, tofilename))
            elif match_b:
                fromfilename = match_b.group(2).strip()
                if not fromfilename.startswith(('.', '/')):
                    continue  # Skip module/package imports
                components = [comp.strip() for comp in match_b.group(1).split(',')]
                fromfilename = os.path.basename(fromfilename.replace('@', '')).rsplit('.', 1)[0]
                for component in components:
                    imports.append((fromfilename, component, tofilename))
            elif match_c:
                fromfilename = match_c.group(1).strip()
                if not fromfilename.startswith(('.', '/')):
                    continue  # Skip module/package imports
                fromfilename = os.path.basename(fromfilename.replace('@', '')).rsplit('.', 1)[0]
                imports.append((fromfilename, None, tofilename))
    return imports
def scan_repository(repo_path):
    """Scans the repository and extracts all import relationships."""
    edges = []
    for root, _, files in os.walk(repo_path):
        if "node_modules" in root:
            continue
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = os.path.join(root, file)
                print(f"Scanning file: {file_path}")
                edges.extend(extract_imports(file_path))
    return edges
def generate_mermaid(edges, output_file):
    """Generates a mermaid flowchart and writes it to an .md file."""
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write("```mermaid\n")
        file.write("graph TD;\n")
        for fromfilename, component, tofilename in edges:
            if component:
                file.write(f"    {fromfilename} -- {component} --> {tofilename}\n")
            else:
                file.write(f"    {fromfilename} --> {tofilename}\n")
        file.write("```\n")
def main():
    repo_path = input("Enter the path of the repository: ")
    output_file = "dependency_graph.md"
    edges = scan_repository(repo_path)
    if not edges:
        print("No import statements found.")
    generate_mermaid(edges, output_file)
    print(f"Dependency graph saved to {output_file}")
if __name__ == "__main__":
    main()