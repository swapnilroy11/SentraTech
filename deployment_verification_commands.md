# Deployment Verification Commands

## Expected Build Log Verification

### 1. Builder Stage Success Indicators:
Look for these lines in the Kaniko build logs:

```
Step X/Y : RUN npm run build
---> Running in [container-id]
> build
> cd frontend && npm run build
> frontend@0.1.1 build
> craco build
Creating an optimized production build...
Compiled successfully.
```

### 2. Debug Output Verification:
```
Step X/Y : RUN echo "Contents of /usr/src/app/frontend/dist" && ls -la /usr/src/app/frontend/dist
Contents of /usr/src/app/frontend/dist
total 56
drwxr-xr-x 4 root root  4096 ... .
drwxr-xr-x 7 root root  4096 ... ..
-rw-r--r-- 1 root root  3461 ... asset-manifest.json
drwxr-xr-x 3 root root  4096 ... images
-rw-r--r-- 1 root root  6823 ... index.html
-rw-r--r-- 1 root root  2194 ... manifest.json
-rw-r--r-- 1 root root   693 ... robots.txt
-rw-r--r-- 1 root root  2046 ... sitemap.xml
drwxr-xr-x 4 root root  4096 ... static
-rw-r--r-- 1 root root 13796 ... sw.js
```

### 3. COPY Stage Success:
```
Step X/Y : COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html
---> [hash]
```
**NO ERROR MESSAGE should appear here**

## Smoke Test Commands (Run Against Preview URL)

### 1. Health Check:
```bash
curl -sS -I http://<preview-url>
```
**Expected**: `HTTP/1.1 200 OK` with proper headers

### 2. HTML Content Check:
```bash
curl -sS http://<preview-url>/ | head -n 20
```
**Expected**: HTML starting with `<!doctype html><html lang="en">`

### 3. SPA Routing Test:
```bash
curl -sS -I http://<preview-url>/non-existent-path
```  
**Expected**: `HTTP/1.1 200 OK` (should serve index.html)

### 4. Static Asset Test:
```bash
curl -sS -I http://<preview-url>/static/css/main.e748e946.css
```
**Expected**: `HTTP/1.1 200 OK` with `content-type: text/css`

## Error Detection

### Original Kaniko Error (Should NOT appear):
```
lstat /scratch/kaniko/0/app/build: no such file or directory
```

### New Potential Errors to Watch For:
```
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html
lstat /scratch/kaniko/0/usr/src/app/frontend/dist: no such file or directory
```

If this appears, it means the build step failed to create the dist directory.

## Success Criteria

✅ **Build Success**: No `lstat` errors in Kaniko logs
✅ **File Creation**: Debug logs show files in `/usr/src/app/frontend/dist`  
✅ **COPY Success**: COPY step completes without errors
✅ **HTTP 200**: Preview URL returns 200 OK
✅ **HTML Served**: Proper HTML content returned  
✅ **SPA Routing**: Non-existent paths serve index.html
✅ **Static Assets**: CSS/JS files accessible