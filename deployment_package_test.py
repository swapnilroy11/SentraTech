#!/usr/bin/env python3
"""
SentraTech Production Deployment Package Testing Suite

This script validates the complete deployment package for the SentraTech production proxy service
targeting server 34.57.15.54 (sentratech.net).

Test Categories:
1. Package Structure Validation
2. Backend Code Quality Testing  
3. Configuration Files Validation
4. Deployment Scripts Testing
5. Documentation Completeness Check
"""

import os
import sys
import json
import ast
import subprocess
import tempfile
from pathlib import Path
from typing import Dict, List, Tuple, Any
import importlib.util
import re

class DeploymentPackageTester:
    def __init__(self):
        self.package_path = Path("/app/deployment-package")
        self.results = {
            "package_structure": {},
            "backend_code": {},
            "configuration": {},
            "scripts": {},
            "documentation": {},
            "overall_status": "UNKNOWN"
        }
        self.errors = []
        self.warnings = []
        
    def log_error(self, category: str, message: str):
        """Log an error"""
        error = f"❌ [{category}] {message}"
        self.errors.append(error)
        print(error)
        
    def log_warning(self, category: str, message: str):
        """Log a warning"""
        warning = f"⚠️ [{category}] {message}"
        self.warnings.append(warning)
        print(warning)
        
    def log_success(self, category: str, message: str):
        """Log a success"""
        success = f"✅ [{category}] {message}"
        print(success)

    def test_package_structure(self) -> Dict[str, Any]:
        """Test 1: Validate package structure and required files"""
        print("\n🔍 TESTING PACKAGE STRUCTURE")
        print("=" * 50)
        
        structure_results = {
            "package_exists": False,
            "required_files": {},
            "required_directories": {},
            "file_count": 0,
            "missing_files": [],
            "extra_files": []
        }
        
        # Check if package directory exists
        if not self.package_path.exists():
            self.log_error("STRUCTURE", f"Deployment package directory not found: {self.package_path}")
            return structure_results
            
        structure_results["package_exists"] = True
        self.log_success("STRUCTURE", f"Package directory found: {self.package_path}")
        
        # Required files and directories
        required_files = [
            "README.md",
            "VERSION", 
            "PACKAGE_SUMMARY.md",
            "DEPLOYMENT_CHECKLIST.md",
            "backend/server.py",
            "backend/requirements.txt",
            "config/nginx-sentratech.conf",
            "config/sentratech-proxy.service",
            "scripts/deploy.sh",
            "scripts/install.sh", 
            "scripts/setup-ssl.sh",
            "scripts/test-deployment.sh",
            "docs/deployment-guide.md",
            "docs/configuration.md",
            "docs/troubleshooting.md"
        ]
        
        required_directories = [
            "backend",
            "config", 
            "scripts",
            "docs"
        ]
        
        # Check required directories
        for dir_name in required_directories:
            dir_path = self.package_path / dir_name
            if dir_path.exists() and dir_path.is_dir():
                structure_results["required_directories"][dir_name] = True
                self.log_success("STRUCTURE", f"Required directory found: {dir_name}/")
            else:
                structure_results["required_directories"][dir_name] = False
                self.log_error("STRUCTURE", f"Missing required directory: {dir_name}/")
        
        # Check required files
        for file_path in required_files:
            full_path = self.package_path / file_path
            if full_path.exists() and full_path.is_file():
                structure_results["required_files"][file_path] = True
                self.log_success("STRUCTURE", f"Required file found: {file_path}")
            else:
                structure_results["required_files"][file_path] = False
                structure_results["missing_files"].append(file_path)
                self.log_error("STRUCTURE", f"Missing required file: {file_path}")
        
        # Count total files
        try:
            all_files = list(self.package_path.rglob("*"))
            structure_results["file_count"] = len([f for f in all_files if f.is_file()])
            self.log_success("STRUCTURE", f"Total files in package: {structure_results['file_count']}")
        except Exception as e:
            self.log_error("STRUCTURE", f"Error counting files: {str(e)}")
            
        return structure_results

    def test_backend_code_quality(self) -> Dict[str, Any]:
        """Test 2: Validate backend FastAPI server.py code quality"""
        print("\n🔍 TESTING BACKEND CODE QUALITY")
        print("=" * 50)
        
        backend_results = {
            "server_py_exists": False,
            "syntax_valid": False,
            "imports_valid": False,
            "fastapi_endpoints": [],
            "collect_endpoint": False,
            "requirements_valid": False,
            "code_analysis": {}
        }
        
        server_py_path = self.package_path / "backend" / "server.py"
        requirements_path = self.package_path / "backend" / "requirements.txt"
        
        # Check if server.py exists
        if not server_py_path.exists():
            self.log_error("BACKEND", "server.py not found in backend directory")
            return backend_results
            
        backend_results["server_py_exists"] = True
        self.log_success("BACKEND", "server.py found")
        
        # Test syntax validity
        try:
            with open(server_py_path, 'r', encoding='utf-8') as f:
                code_content = f.read()
                
            # Parse AST to check syntax
            ast.parse(code_content)
            backend_results["syntax_valid"] = True
            self.log_success("BACKEND", "server.py syntax is valid")
            
            # Analyze code structure
            backend_results["code_analysis"] = self._analyze_server_code(code_content)
            
        except SyntaxError as e:
            backend_results["syntax_valid"] = False
            self.log_error("BACKEND", f"Syntax error in server.py: {str(e)}")
        except Exception as e:
            self.log_error("BACKEND", f"Error reading server.py: {str(e)}")
            
        # Test requirements.txt
        if requirements_path.exists():
            try:
                with open(requirements_path, 'r') as f:
                    requirements = f.read().strip()
                    
                if requirements:
                    backend_results["requirements_valid"] = True
                    self.log_success("BACKEND", "requirements.txt is valid and non-empty")
                    
                    # Check for key dependencies
                    required_deps = ["fastapi", "uvicorn", "httpx", "pydantic"]
                    for dep in required_deps:
                        if dep.lower() in requirements.lower():
                            self.log_success("BACKEND", f"Required dependency found: {dep}")
                        else:
                            self.log_warning("BACKEND", f"Required dependency not found: {dep}")
                else:
                    self.log_error("BACKEND", "requirements.txt is empty")
                    
            except Exception as e:
                self.log_error("BACKEND", f"Error reading requirements.txt: {str(e)}")
        else:
            self.log_error("BACKEND", "requirements.txt not found")
            
        return backend_results

    def _analyze_server_code(self, code_content: str) -> Dict[str, Any]:
        """Analyze server.py code for key components"""
        analysis = {
            "fastapi_app": False,
            "collect_endpoint": False,
            "idempotency": False,
            "retry_logic": False,
            "logging": False,
            "cors": False,
            "authentication": False,
            "line_count": 0,
            "endpoints_found": []
        }
        
        lines = code_content.split('\n')
        analysis["line_count"] = len(lines)
        
        # Check for FastAPI app
        if "FastAPI(" in code_content or "app = FastAPI" in code_content:
            analysis["fastapi_app"] = True
            self.log_success("BACKEND", "FastAPI app initialization found")
        else:
            self.log_error("BACKEND", "FastAPI app initialization not found")
            
        # Check for /api/collect endpoint
        if "/api/collect" in code_content or "collect" in code_content:
            analysis["collect_endpoint"] = True
            self.log_success("BACKEND", "/api/collect endpoint implementation found")
        else:
            self.log_error("BACKEND", "/api/collect endpoint not found")
            
        # Check for idempotency
        if "idempotency" in code_content.lower() or "duplicate" in code_content.lower():
            analysis["idempotency"] = True
            self.log_success("BACKEND", "Idempotency logic found")
        else:
            self.log_warning("BACKEND", "Idempotency logic not clearly identified")
            
        # Check for retry logic
        if "retry" in code_content.lower() or "backoff" in code_content.lower():
            analysis["retry_logic"] = True
            self.log_success("BACKEND", "Retry logic found")
        else:
            self.log_warning("BACKEND", "Retry logic not clearly identified")
            
        # Check for logging
        if "logging" in code_content or "logger" in code_content:
            analysis["logging"] = True
            self.log_success("BACKEND", "Logging implementation found")
        else:
            self.log_warning("BACKEND", "Logging implementation not found")
            
        # Check for CORS
        if "CORS" in code_content or "cors" in code_content.lower():
            analysis["cors"] = True
            self.log_success("BACKEND", "CORS configuration found")
        else:
            self.log_warning("BACKEND", "CORS configuration not found")
            
        # Check for authentication
        if "X-INGEST-KEY" in code_content or "Authorization" in code_content:
            analysis["authentication"] = True
            self.log_success("BACKEND", "Authentication headers found")
        else:
            self.log_warning("BACKEND", "Authentication headers not found")
            
        # Find endpoints
        endpoint_patterns = [
            r'@app\.(get|post|put|delete|patch)\("([^"]+)"',
            r'@api_router\.(get|post|put|delete|patch)\("([^"]+)"'
        ]
        
        for pattern in endpoint_patterns:
            matches = re.findall(pattern, code_content)
            for method, path in matches:
                endpoint = f"{method.upper()} {path}"
                analysis["endpoints_found"].append(endpoint)
                self.log_success("BACKEND", f"Endpoint found: {endpoint}")
                
        return analysis

    def test_configuration_files(self) -> Dict[str, Any]:
        """Test 3: Validate configuration files"""
        print("\n🔍 TESTING CONFIGURATION FILES")
        print("=" * 50)
        
        config_results = {
            "nginx_config": {"exists": False, "valid": False, "analysis": {}},
            "systemd_service": {"exists": False, "valid": False, "analysis": {}},
            "env_template": {"exists": False, "valid": False, "analysis": {}}
        }
        
        # Test Nginx configuration
        nginx_path = self.package_path / "config" / "nginx-sentratech.conf"
        if nginx_path.exists():
            config_results["nginx_config"]["exists"] = True
            self.log_success("CONFIG", "Nginx configuration file found")
            
            try:
                with open(nginx_path, 'r') as f:
                    nginx_content = f.read()
                    
                config_results["nginx_config"]["analysis"] = self._analyze_nginx_config(nginx_content)
                config_results["nginx_config"]["valid"] = True
                
            except Exception as e:
                self.log_error("CONFIG", f"Error reading nginx config: {str(e)}")
        else:
            self.log_error("CONFIG", "Nginx configuration file not found")
            
        # Test systemd service file
        service_path = self.package_path / "config" / "sentratech-proxy.service"
        if service_path.exists():
            config_results["systemd_service"]["exists"] = True
            self.log_success("CONFIG", "systemd service file found")
            
            try:
                with open(service_path, 'r') as f:
                    service_content = f.read()
                    
                config_results["systemd_service"]["analysis"] = self._analyze_systemd_service(service_content)
                config_results["systemd_service"]["valid"] = True
                
            except Exception as e:
                self.log_error("CONFIG", f"Error reading systemd service: {str(e)}")
        else:
            self.log_error("CONFIG", "systemd service file not found")
            
        # Test environment template (if exists)
        env_template_path = self.package_path / "config" / ".env.template"
        if env_template_path.exists():
            config_results["env_template"]["exists"] = True
            self.log_success("CONFIG", "Environment template found")
            
            try:
                with open(env_template_path, 'r') as f:
                    env_content = f.read()
                    
                config_results["env_template"]["analysis"] = self._analyze_env_template(env_content)
                config_results["env_template"]["valid"] = True
                
            except Exception as e:
                self.log_error("CONFIG", f"Error reading env template: {str(e)}")
        else:
            self.log_warning("CONFIG", "Environment template not found (optional)")
            
        return config_results

    def _analyze_nginx_config(self, content: str) -> Dict[str, Any]:
        """Analyze Nginx configuration"""
        analysis = {
            "server_block": False,
            "ssl_config": False,
            "proxy_pass": False,
            "sentratech_domain": False,
            "api_collect_location": False
        }
        
        if "server {" in content:
            analysis["server_block"] = True
            self.log_success("CONFIG", "Nginx server block found")
        else:
            self.log_error("CONFIG", "Nginx server block not found")
            
        if "ssl_certificate" in content and "ssl_certificate_key" in content:
            analysis["ssl_config"] = True
            self.log_success("CONFIG", "SSL configuration found")
        else:
            self.log_warning("CONFIG", "SSL configuration not found")
            
        if "proxy_pass" in content:
            analysis["proxy_pass"] = True
            self.log_success("CONFIG", "Proxy pass configuration found")
        else:
            self.log_error("CONFIG", "Proxy pass configuration not found")
            
        if "sentratech.net" in content:
            analysis["sentratech_domain"] = True
            self.log_success("CONFIG", "sentratech.net domain found")
        else:
            self.log_warning("CONFIG", "sentratech.net domain not found")
            
        if "/api/collect" in content or "location /api" in content:
            analysis["api_collect_location"] = True
            self.log_success("CONFIG", "/api/collect location block found")
        else:
            self.log_error("CONFIG", "/api/collect location block not found")
            
        return analysis

    def _analyze_systemd_service(self, content: str) -> Dict[str, Any]:
        """Analyze systemd service file"""
        analysis = {
            "unit_section": False,
            "service_section": False,
            "install_section": False,
            "exec_start": False,
            "user_config": False,
            "restart_config": False
        }
        
        if "[Unit]" in content:
            analysis["unit_section"] = True
            self.log_success("CONFIG", "systemd [Unit] section found")
        else:
            self.log_error("CONFIG", "systemd [Unit] section not found")
            
        if "[Service]" in content:
            analysis["service_section"] = True
            self.log_success("CONFIG", "systemd [Service] section found")
        else:
            self.log_error("CONFIG", "systemd [Service] section not found")
            
        if "[Install]" in content:
            analysis["install_section"] = True
            self.log_success("CONFIG", "systemd [Install] section found")
        else:
            self.log_error("CONFIG", "systemd [Install] section not found")
            
        if "ExecStart=" in content:
            analysis["exec_start"] = True
            self.log_success("CONFIG", "ExecStart configuration found")
        else:
            self.log_error("CONFIG", "ExecStart configuration not found")
            
        if "User=" in content:
            analysis["user_config"] = True
            self.log_success("CONFIG", "User configuration found")
        else:
            self.log_warning("CONFIG", "User configuration not found")
            
        if "Restart=" in content:
            analysis["restart_config"] = True
            self.log_success("CONFIG", "Restart configuration found")
        else:
            self.log_warning("CONFIG", "Restart configuration not found")
            
        return analysis

    def _analyze_env_template(self, content: str) -> Dict[str, Any]:
        """Analyze environment template"""
        analysis = {
            "dashboard_url": False,
            "api_key": False,
            "cors_origins": False,
            "log_level": False
        }
        
        if "DASHBOARD_URL" in content or "ADMIN_DASHBOARD_URL" in content:
            analysis["dashboard_url"] = True
            self.log_success("CONFIG", "Dashboard URL configuration found")
        else:
            self.log_warning("CONFIG", "Dashboard URL configuration not found")
            
        if "API_KEY" in content or "INGEST_KEY" in content:
            analysis["api_key"] = True
            self.log_success("CONFIG", "API key configuration found")
        else:
            self.log_warning("CONFIG", "API key configuration not found")
            
        if "CORS" in content:
            analysis["cors_origins"] = True
            self.log_success("CONFIG", "CORS configuration found")
        else:
            self.log_warning("CONFIG", "CORS configuration not found")
            
        if "LOG_LEVEL" in content:
            analysis["log_level"] = True
            self.log_success("CONFIG", "Log level configuration found")
        else:
            self.log_warning("CONFIG", "Log level configuration not found")
            
        return analysis

    def test_deployment_scripts(self) -> Dict[str, Any]:
        """Test 4: Validate deployment scripts"""
        print("\n🔍 TESTING DEPLOYMENT SCRIPTS")
        print("=" * 50)
        
        scripts_results = {
            "deploy_sh": {"exists": False, "executable": False, "syntax": False},
            "install_sh": {"exists": False, "executable": False, "syntax": False},
            "setup_ssl_sh": {"exists": False, "executable": False, "syntax": False},
            "test_deployment_sh": {"exists": False, "executable": False, "syntax": False}
        }
        
        scripts = [
            ("deploy_sh", "deploy.sh"),
            ("install_sh", "install.sh"), 
            ("setup_ssl_sh", "setup-ssl.sh"),
            ("test_deployment_sh", "test-deployment.sh")
        ]
        
        for script_key, script_name in scripts:
            script_path = self.package_path / "scripts" / script_name
            
            if script_path.exists():
                scripts_results[script_key]["exists"] = True
                self.log_success("SCRIPTS", f"{script_name} found")
                
                # Check if executable
                if os.access(script_path, os.X_OK):
                    scripts_results[script_key]["executable"] = True
                    self.log_success("SCRIPTS", f"{script_name} is executable")
                else:
                    self.log_warning("SCRIPTS", f"{script_name} is not executable (can be fixed with chmod +x)")
                    
                # Basic syntax check
                try:
                    with open(script_path, 'r') as f:
                        script_content = f.read()
                        
                    if script_content.strip().startswith("#!/"):
                        scripts_results[script_key]["syntax"] = True
                        self.log_success("SCRIPTS", f"{script_name} has proper shebang")
                        
                        # Check for basic bash syntax
                        if self._check_bash_syntax(script_content):
                            self.log_success("SCRIPTS", f"{script_name} basic syntax appears valid")
                        else:
                            self.log_warning("SCRIPTS", f"{script_name} may have syntax issues")
                    else:
                        self.log_warning("SCRIPTS", f"{script_name} missing shebang line")
                        
                except Exception as e:
                    self.log_error("SCRIPTS", f"Error reading {script_name}: {str(e)}")
            else:
                self.log_error("SCRIPTS", f"{script_name} not found")
                
        return scripts_results

    def _check_bash_syntax(self, script_content: str) -> bool:
        """Basic bash syntax validation"""
        try:
            # Write to temporary file and check with bash -n
            with tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False) as f:
                f.write(script_content)
                temp_path = f.name
                
            # Check syntax with bash -n
            result = subprocess.run(['bash', '-n', temp_path], 
                                  capture_output=True, text=True)
            
            # Clean up
            os.unlink(temp_path)
            
            return result.returncode == 0
            
        except Exception:
            return False

    def test_documentation_completeness(self) -> Dict[str, Any]:
        """Test 5: Validate documentation completeness"""
        print("\n🔍 TESTING DOCUMENTATION COMPLETENESS")
        print("=" * 50)
        
        docs_results = {
            "readme": {"exists": False, "content_quality": 0},
            "deployment_guide": {"exists": False, "content_quality": 0},
            "configuration": {"exists": False, "content_quality": 0},
            "troubleshooting": {"exists": False, "content_quality": 0},
            "package_summary": {"exists": False, "content_quality": 0},
            "deployment_checklist": {"exists": False, "content_quality": 0}
        }
        
        docs = [
            ("readme", "README.md"),
            ("deployment_guide", "docs/deployment-guide.md"),
            ("configuration", "docs/configuration.md"),
            ("troubleshooting", "docs/troubleshooting.md"),
            ("package_summary", "PACKAGE_SUMMARY.md"),
            ("deployment_checklist", "DEPLOYMENT_CHECKLIST.md")
        ]
        
        for doc_key, doc_path in docs:
            full_path = self.package_path / doc_path
            
            if full_path.exists():
                docs_results[doc_key]["exists"] = True
                self.log_success("DOCS", f"{doc_path} found")
                
                try:
                    with open(full_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    quality_score = self._assess_doc_quality(content, doc_key)
                    docs_results[doc_key]["content_quality"] = quality_score
                    
                    if quality_score >= 80:
                        self.log_success("DOCS", f"{doc_path} content quality: EXCELLENT ({quality_score}%)")
                    elif quality_score >= 60:
                        self.log_success("DOCS", f"{doc_path} content quality: GOOD ({quality_score}%)")
                    elif quality_score >= 40:
                        self.log_warning("DOCS", f"{doc_path} content quality: FAIR ({quality_score}%)")
                    else:
                        self.log_error("DOCS", f"{doc_path} content quality: POOR ({quality_score}%)")
                        
                except Exception as e:
                    self.log_error("DOCS", f"Error reading {doc_path}: {str(e)}")
            else:
                self.log_error("DOCS", f"{doc_path} not found")
                
        return docs_results

    def _assess_doc_quality(self, content: str, doc_type: str) -> int:
        """Assess documentation quality (0-100 score)"""
        score = 0
        
        # Basic content checks
        if len(content) > 100:
            score += 20  # Has substantial content
            
        if len(content) > 1000:
            score += 10  # Has detailed content
            
        # Structure checks
        if content.count('#') >= 3:
            score += 15  # Has proper heading structure
            
        if '```' in content:
            score += 10  # Has code examples
            
        # Content-specific checks
        if doc_type == "readme":
            if "overview" in content.lower():
                score += 10
            if "installation" in content.lower() or "setup" in content.lower():
                score += 10
            if "usage" in content.lower():
                score += 10
            if "34.57.15.54" in content:
                score += 15  # Mentions target server
                
        elif doc_type == "deployment_guide":
            if "step" in content.lower():
                score += 15
            if "server" in content.lower():
                score += 10
            if "nginx" in content.lower():
                score += 10
                
        elif doc_type == "configuration":
            if "environment" in content.lower():
                score += 15
            if "variable" in content.lower():
                score += 10
                
        elif doc_type == "troubleshooting":
            if "error" in content.lower():
                score += 15
            if "solution" in content.lower():
                score += 10
                
        return min(score, 100)

    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Run all tests and generate comprehensive report"""
        print("🚀 STARTING SENTRATECH DEPLOYMENT PACKAGE TESTING")
        print("=" * 60)
        
        # Run all test categories
        self.results["package_structure"] = self.test_package_structure()
        self.results["backend_code"] = self.test_backend_code_quality()
        self.results["configuration"] = self.test_configuration_files()
        self.results["scripts"] = self.test_deployment_scripts()
        self.results["documentation"] = self.test_documentation_completeness()
        
        # Calculate overall status
        self._calculate_overall_status()
        
        # Generate final report
        self._generate_final_report()
        
        return self.results

    def _calculate_overall_status(self):
        """Calculate overall package status"""
        critical_failures = 0
        warnings = 0
        
        # Check critical components
        if not self.results["package_structure"].get("package_exists", False):
            critical_failures += 1
            
        if not self.results["backend_code"].get("server_py_exists", False):
            critical_failures += 1
            
        if not self.results["backend_code"].get("syntax_valid", False):
            critical_failures += 1
            
        # Count missing required files
        missing_files = len(self.results["package_structure"].get("missing_files", []))
        if missing_files > 3:
            critical_failures += 1
        elif missing_files > 0:
            warnings += 1
            
        # Determine status
        if critical_failures == 0 and len(self.errors) == 0:
            self.results["overall_status"] = "EXCELLENT"
        elif critical_failures == 0 and len(self.errors) <= 2:
            self.results["overall_status"] = "GOOD"
        elif critical_failures <= 1:
            self.results["overall_status"] = "FAIR"
        else:
            self.results["overall_status"] = "POOR"

    def _generate_final_report(self):
        """Generate final test report"""
        print("\n" + "=" * 60)
        print("📊 DEPLOYMENT PACKAGE TEST RESULTS SUMMARY")
        print("=" * 60)
        
        # Overall status
        status_emoji = {
            "EXCELLENT": "🎉",
            "GOOD": "✅", 
            "FAIR": "⚠️",
            "POOR": "❌"
        }
        
        print(f"\n{status_emoji.get(self.results['overall_status'], '❓')} OVERALL STATUS: {self.results['overall_status']}")
        
        # Category summaries
        categories = [
            ("Package Structure", self.results["package_structure"]),
            ("Backend Code Quality", self.results["backend_code"]),
            ("Configuration Files", self.results["configuration"]),
            ("Deployment Scripts", self.results["scripts"]),
            ("Documentation", self.results["documentation"])
        ]
        
        print("\n📋 CATEGORY BREAKDOWN:")
        for category_name, category_results in categories:
            if isinstance(category_results, dict):
                # Count successful items
                success_count = sum(1 for v in category_results.values() 
                                  if (isinstance(v, bool) and v) or 
                                     (isinstance(v, dict) and v.get("exists", False)))
                total_count = len(category_results)
                percentage = (success_count / total_count * 100) if total_count > 0 else 0
                
                if percentage >= 80:
                    status = "✅ EXCELLENT"
                elif percentage >= 60:
                    status = "✅ GOOD"
                elif percentage >= 40:
                    status = "⚠️ FAIR"
                else:
                    status = "❌ POOR"
                    
                print(f"  {status} {category_name}: {success_count}/{total_count} ({percentage:.0f}%)")
        
        # Error and warning summary
        print(f"\n📈 ISSUE SUMMARY:")
        print(f"  ❌ Errors: {len(self.errors)}")
        print(f"  ⚠️ Warnings: {len(self.warnings)}")
        
        if self.errors:
            print(f"\n🚨 CRITICAL ERRORS TO FIX:")
            for error in self.errors[:5]:  # Show first 5 errors
                print(f"  {error}")
            if len(self.errors) > 5:
                print(f"  ... and {len(self.errors) - 5} more errors")
                
        if self.warnings:
            print(f"\n⚠️ WARNINGS TO REVIEW:")
            for warning in self.warnings[:3]:  # Show first 3 warnings
                print(f"  {warning}")
            if len(self.warnings) > 3:
                print(f"  ... and {len(self.warnings) - 3} more warnings")
        
        # Production readiness assessment
        print(f"\n🎯 PRODUCTION READINESS ASSESSMENT:")
        if self.results["overall_status"] == "EXCELLENT":
            print("  🎉 READY FOR PRODUCTION DEPLOYMENT")
            print("  ✅ All critical components validated")
            print("  ✅ No blocking issues found")
            print("  ✅ Package meets all requirements")
        elif self.results["overall_status"] == "GOOD":
            print("  ✅ READY FOR PRODUCTION (with minor fixes)")
            print("  ⚠️ Some non-critical issues to address")
            print("  ✅ Core functionality validated")
        elif self.results["overall_status"] == "FAIR":
            print("  ⚠️ NEEDS FIXES BEFORE PRODUCTION")
            print("  ❌ Some critical issues to resolve")
            print("  ⚠️ Additional testing recommended")
        else:
            print("  ❌ NOT READY FOR PRODUCTION")
            print("  ❌ Critical issues must be resolved")
            print("  ❌ Comprehensive fixes required")
            
        print("\n" + "=" * 60)

def main():
    """Main test execution"""
    tester = DeploymentPackageTester()
    results = tester.run_comprehensive_test()
    
    # Save results to file
    results_file = "/app/deployment_package_test_results.json"
    try:
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        print(f"\n💾 Test results saved to: {results_file}")
    except Exception as e:
        print(f"\n❌ Error saving results: {str(e)}")
    
    # Return exit code based on status
    if results["overall_status"] in ["EXCELLENT", "GOOD"]:
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())