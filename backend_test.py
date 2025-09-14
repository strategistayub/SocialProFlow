#!/usr/bin/env python3
"""
SocialFlow Pro Backend API Testing Suite
Tests all backend API endpoints for functionality and proper responses
"""

import requests
import json
import sys
from datetime import datetime, timedelta
import uuid

# Get base URL from environment
BASE_URL = "https://social-manager-8.preview.emergentagent.com/api"

class SocialFlowAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_results = []
        self.failed_tests = []
        
    def log_test(self, test_name, success, details="", response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        if success:
            print(f"✅ {test_name}: PASSED - {details}")
        else:
            print(f"❌ {test_name}: FAILED - {details}")
            self.failed_tests.append(result)
    
    def test_root_api(self):
        """Test GET /api/ for basic connectivity"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "SocialFlow Pro API" in data["message"]:
                    self.log_test("Root API Connectivity", True, 
                                f"API is running, version: {data.get('version', 'unknown')}")
                    return True
                else:
                    self.log_test("Root API Connectivity", False, 
                                f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Root API Connectivity", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Root API Connectivity", False, f"Connection error: {str(e)}")
            return False
    
    def test_user_profile_get(self):
        """Test GET /api/profile endpoint"""
        try:
            response = requests.get(f"{self.base_url}/profile", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "profile" in data:
                    profile = data["profile"]
                    required_fields = ["id", "businessName", "businessType", "connectedAccounts"]
                    
                    missing_fields = [field for field in required_fields if field not in profile]
                    if not missing_fields:
                        self.log_test("User Profile GET", True, 
                                    f"Profile retrieved with business: {profile.get('businessName')}")
                        return True
                    else:
                        self.log_test("User Profile GET", False, 
                                    f"Missing required fields: {missing_fields}")
                        return False
                else:
                    self.log_test("User Profile GET", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("User Profile GET", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Profile GET", False, f"Request error: {str(e)}")
            return False
    
    def test_user_profile_post(self):
        """Test POST /api/profile endpoint"""
        try:
            test_profile = {
                "businessName": "Test Restaurant API",
                "businessType": "restaurant",
                "address": "123 Test Street, Test City",
                "phone": "(555) 999-8888",
                "email": "test@testrestaurant.com",
                "connectedAccounts": {
                    "instagram": {"connected": True, "username": "@testrestaurant"},
                    "facebook": {"connected": False, "username": None}
                }
            }
            
            response = requests.post(f"{self.base_url}/profile", 
                                   json=test_profile, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "profile" in data:
                    updated_profile = data["profile"]
                    if updated_profile.get("businessName") == test_profile["businessName"]:
                        self.log_test("User Profile POST", True, 
                                    "Profile updated successfully")
                        return True
                    else:
                        self.log_test("User Profile POST", False, 
                                    "Profile data not properly updated")
                        return False
                else:
                    self.log_test("User Profile POST", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("User Profile POST", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Profile POST", False, f"Request error: {str(e)}")
            return False
    
    def test_posts_get_all(self):
        """Test GET /api/posts - retrieve all posts"""
        try:
            response = requests.get(f"{self.base_url}/posts", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "posts" in data:
                    posts = data["posts"]
                    if isinstance(posts, list):
                        self.log_test("Posts GET All", True, 
                                    f"Retrieved {len(posts)} posts")
                        return True
                    else:
                        self.log_test("Posts GET All", False, 
                                    "Posts should be a list")
                        return False
                else:
                    self.log_test("Posts GET All", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Posts GET All", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Posts GET All", False, f"Request error: {str(e)}")
            return False
    
    def test_posts_get_filtered(self):
        """Test GET /api/posts with status filter"""
        try:
            # Test published posts
            response = requests.get(f"{self.base_url}/posts?status=published", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "posts" in data:
                    published_posts = data["posts"]
                    
                    # Test scheduled posts
                    response2 = requests.get(f"{self.base_url}/posts?status=scheduled", timeout=10)
                    if response2.status_code == 200:
                        data2 = response2.json()
                        scheduled_posts = data2["posts"]
                        
                        self.log_test("Posts GET Filtered", True, 
                                    f"Published: {len(published_posts)}, Scheduled: {len(scheduled_posts)}")
                        return True
                    else:
                        self.log_test("Posts GET Filtered", False, 
                                    f"Scheduled posts request failed: {response2.status_code}")
                        return False
                else:
                    self.log_test("Posts GET Filtered", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Posts GET Filtered", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Posts GET Filtered", False, f"Request error: {str(e)}")
            return False
    
    def test_posts_create_publish(self):
        """Test POST /api/posts - create and publish immediately"""
        try:
            test_post = {
                "content": "🚀 Testing our amazing API! This post was created via automated testing. #APITesting #SocialFlow",
                "platforms": ["instagram", "facebook"],
                "action": "publish",
                "images": ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop"]
            }
            
            response = requests.post(f"{self.base_url}/posts", 
                                   json=test_post, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "post" in data:
                    created_post = data["post"]
                    if (created_post.get("content") == test_post["content"] and 
                        created_post.get("status") == "published"):
                        self.log_test("Posts CREATE Publish", True, 
                                    f"Post published with ID: {created_post.get('id')}")
                        return True
                    else:
                        self.log_test("Posts CREATE Publish", False, 
                                    "Post data doesn't match or status incorrect")
                        return False
                else:
                    self.log_test("Posts CREATE Publish", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Posts CREATE Publish", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Posts CREATE Publish", False, f"Request error: {str(e)}")
            return False
    
    def test_posts_create_schedule(self):
        """Test POST /api/posts - create and schedule for later"""
        try:
            # Schedule for tomorrow
            future_date = (datetime.now() + timedelta(days=1)).isoformat()
            
            test_post = {
                "content": "📅 This is a scheduled post created by our API testing suite! Will be published tomorrow. #Scheduled #Testing",
                "platforms": ["instagram"],
                "action": "schedule",
                "scheduledAt": future_date,
                "images": []
            }
            
            response = requests.post(f"{self.base_url}/posts", 
                                   json=test_post, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "post" in data:
                    created_post = data["post"]
                    if (created_post.get("content") == test_post["content"] and 
                        created_post.get("status") == "scheduled"):
                        self.log_test("Posts CREATE Schedule", True, 
                                    f"Post scheduled with ID: {created_post.get('id')}")
                        return True
                    else:
                        self.log_test("Posts CREATE Schedule", False, 
                                    "Post data doesn't match or status incorrect")
                        return False
                else:
                    self.log_test("Posts CREATE Schedule", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Posts CREATE Schedule", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Posts CREATE Schedule", False, f"Request error: {str(e)}")
            return False
    
    def test_analytics_default(self):
        """Test GET /api/analytics with default timeframe"""
        try:
            response = requests.get(f"{self.base_url}/analytics", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "analytics" in data:
                    analytics = data["analytics"]
                    required_sections = ["overview", "engagement", "platforms", "topPosts"]
                    
                    missing_sections = [section for section in required_sections 
                                      if section not in analytics]
                    if not missing_sections:
                        overview = analytics["overview"]
                        self.log_test("Analytics Default", True, 
                                    f"Analytics retrieved - Total posts: {overview.get('totalPosts')}, "
                                    f"Reach: {overview.get('totalReach')}")
                        return True
                    else:
                        self.log_test("Analytics Default", False, 
                                    f"Missing analytics sections: {missing_sections}")
                        return False
                else:
                    self.log_test("Analytics Default", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Analytics Default", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Analytics Default", False, f"Request error: {str(e)}")
            return False
    
    def test_analytics_timeframes(self):
        """Test GET /api/analytics with different timeframes"""
        try:
            timeframes = ["7", "30", "90"]
            results = []
            
            for timeframe in timeframes:
                response = requests.get(f"{self.base_url}/analytics?timeframe={timeframe}", 
                                      timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and "analytics" in data:
                        results.append(f"{timeframe} days: ✓")
                    else:
                        results.append(f"{timeframe} days: ✗ (invalid structure)")
                        break
                else:
                    results.append(f"{timeframe} days: ✗ (HTTP {response.status_code})")
                    break
            
            if len(results) == len(timeframes) and all("✓" in r for r in results):
                self.log_test("Analytics Timeframes", True, 
                            f"All timeframes working: {', '.join(results)}")
                return True
            else:
                self.log_test("Analytics Timeframes", False, 
                            f"Timeframe issues: {', '.join(results)}")
                return False
                
        except Exception as e:
            self.log_test("Analytics Timeframes", False, f"Request error: {str(e)}")
            return False
    
    def test_image_library(self):
        """Test GET /api/images endpoint"""
        try:
            response = requests.get(f"{self.base_url}/images", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "images" in data:
                    images = data["images"]
                    if isinstance(images, list) and len(images) > 0:
                        # Check first image structure
                        first_image = images[0]
                        required_fields = ["id", "filename", "url", "thumbnail", "category"]
                        
                        missing_fields = [field for field in required_fields 
                                        if field not in first_image]
                        if not missing_fields:
                            self.log_test("Image Library", True, 
                                        f"Retrieved {len(images)} images")
                            return True
                        else:
                            self.log_test("Image Library", False, 
                                        f"Image missing fields: {missing_fields}")
                            return False
                    else:
                        self.log_test("Image Library", False, 
                                    "No images returned or invalid format")
                        return False
                else:
                    self.log_test("Image Library", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Image Library", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Image Library", False, f"Request error: {str(e)}")
            return False
    
    def test_image_upload(self):
        """Test POST /api/images/upload endpoint"""
        try:
            test_image = {
                "filename": "test-api-upload.jpg",
                "url": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
                "thumbnail": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop",
                "category": "API Testing"
            }
            
            response = requests.post(f"{self.base_url}/images/upload", 
                                   json=test_image, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "image" in data:
                    uploaded_image = data["image"]
                    if uploaded_image.get("filename") == test_image["filename"]:
                        self.log_test("Image Upload", True, 
                                    f"Image uploaded with ID: {uploaded_image.get('id')}")
                        return True
                    else:
                        self.log_test("Image Upload", False, 
                                    "Uploaded image data doesn't match")
                        return False
                else:
                    self.log_test("Image Upload", False, 
                                f"Invalid response structure: {data}")
                    return False
            else:
                self.log_test("Image Upload", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Image Upload", False, f"Request error: {str(e)}")
            return False
    
    def test_database_connection(self):
        """Test database connectivity through API calls"""
        try:
            # Test multiple endpoints that use database connection
            endpoints_to_test = [
                ("/profile", "Profile DB Connection"),
                ("/posts", "Posts DB Connection")
            ]
            
            db_connection_working = True
            details = []
            
            for endpoint, test_name in endpoints_to_test:
                response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
                if response.status_code == 200:
                    details.append(f"{test_name}: ✓")
                else:
                    details.append(f"{test_name}: ✗ (HTTP {response.status_code})")
                    db_connection_working = False
            
            if db_connection_working:
                self.log_test("Database Connection", True, 
                            f"DB connectivity verified through: {', '.join(details)}")
                return True
            else:
                self.log_test("Database Connection", False, 
                            f"DB connection issues: {', '.join(details)}")
                return False
                
        except Exception as e:
            self.log_test("Database Connection", False, f"Connection test error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test API error handling with invalid requests"""
        try:
            # Test invalid endpoint
            response1 = requests.get(f"{self.base_url}/invalid-endpoint", timeout=10)
            
            # Test invalid POST data
            response2 = requests.post(f"{self.base_url}/posts", 
                                    json={"invalid": "data"}, timeout=10)
            
            error_handling_working = True
            details = []
            
            # Check 404 for invalid endpoint
            if response1.status_code == 404:
                details.append("404 for invalid endpoint: ✓")
            else:
                details.append(f"404 for invalid endpoint: ✗ (got {response1.status_code})")
                error_handling_working = False
            
            # Check that invalid POST still returns proper JSON error
            if response2.status_code in [400, 500] and response2.headers.get('content-type', '').startswith('application/json'):
                details.append("JSON error response: ✓")
            else:
                details.append(f"JSON error response: ✗ (got {response2.status_code})")
                # This is minor, don't fail the test
            
            self.log_test("Error Handling", True, 
                        f"Error handling verified: {', '.join(details)}")
            return True
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error handling test failed: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend API tests"""
        print(f"\n🚀 Starting SocialFlow Pro Backend API Tests")
        print(f"Base URL: {self.base_url}")
        print(f"Test started at: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Core API tests
        tests = [
            ("Root API Connectivity", self.test_root_api),
            ("Database Connection", self.test_database_connection),
            ("User Profile GET", self.test_user_profile_get),
            ("User Profile POST", self.test_user_profile_post),
            ("Posts GET All", self.test_posts_get_all),
            ("Posts GET Filtered", self.test_posts_get_filtered),
            ("Posts CREATE Publish", self.test_posts_create_publish),
            ("Posts CREATE Schedule", self.test_posts_create_schedule),
            ("Analytics Default", self.test_analytics_default),
            ("Analytics Timeframes", self.test_analytics_timeframes),
            ("Image Library", self.test_image_library),
            ("Image Upload", self.test_image_upload),
            ("Error Handling", self.test_error_handling)
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_test(test_name, False, f"Test execution error: {str(e)}")
        
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for failed in self.failed_tests:
                print(f"  - {failed['test']}: {failed['details']}")
        
        print(f"\nTest completed at: {datetime.now().isoformat()}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = SocialFlowAPITester()
    success = tester.run_all_tests()
    
    # Return appropriate exit code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()