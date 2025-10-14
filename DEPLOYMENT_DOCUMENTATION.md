# Strategic Advisor Update - Deployment Documentation

## 🎯 **Deployment Overview**
**Project**: SentraTech Website Update
**Target Environment**: Production (https://sentratech.net/)
**Server**: 35.57.15.54
**Date**: October 2025
**Priority**: Medium

---

## 📝 **Changes Summary**

### What's Being Deployed:
1. **Strategic Advisor Addition**: Taufiq Ahamed Emon
2. **Image Asset**: Professional photo with B&W styling
3. **Content Updates**: Role, description, and expertise

### Files Modified:
- `frontend/src/pages/InvestorRelationsPage.js` - Added advisor profile
- `frontend/public/images/advisors/taufiq-ahamed-emon.jpg` - New image asset (233KB)

### Sections Affected:
- Investor Relations page → Strategic Advisors section
- Middle card position (replacing existing advisor)
- Maintains 3 total advisors

---

## 🔍 **Pre-Deployment Verification**

### Development Environment Status:
- ✅ **Functionality**: All features working correctly
- ✅ **Content**: Name, role, description properly displayed  
- ✅ **Image**: Photo loads with correct B&W styling
- ✅ **Layout**: Card positioned correctly in middle
- ✅ **Responsive**: Works on desktop and mobile
- ✅ **Navigation**: Page routing functional

### Technical Verification:
- ✅ **File Size**: Image optimized at 233KB
- ✅ **Code Quality**: No syntax errors or warnings
- ✅ **Performance**: No loading delays observed
- ✅ **SEO**: Meta tags and structure maintained

---

## 🚀 **Deployment Steps**

### Step 1: Backup Current Production
```bash
# Create backup of current files
cp InvestorRelationsPage.js InvestorRelationsPage.js.backup.$(date +%Y%m%d)
```

### Step 2: Deploy New Files
Choose one method:
- **Method A**: Git pull (if CI/CD configured)
- **Method B**: Direct file transfer via SCP
- **Method C**: Docker container update

### Step 3: Build and Restart
```bash
npm run build
sudo systemctl restart webserver
```

### Step 4: Verify Deployment
- Check https://sentratech.net/investor-relations
- Verify Strategic Advisors section
- Confirm Taufiq Ahamed Emon appears in middle position

---

## ✅ **Post-Deployment Testing**

### Manual Testing Checklist:
- [ ] Page loads without errors
- [ ] Strategic Advisors section visible
- [ ] Taufiq Ahamed Emon card displays correctly
- [ ] Photo loads and shows B&W styling  
- [ ] Role shows "Visionary Tech Leadership"
- [ ] Description text complete and readable
- [ ] Mobile responsiveness maintained
- [ ] Other advisors (left/right) unchanged

### Automated Testing:
```bash
# Test page accessibility
curl -I https://sentratech.net/investor-relations

# Check for specific content
curl -s https://sentratech.net/investor-relations | grep -i "taufiq"
curl -s https://sentratech.net/investor-relations | grep -i "visionary"
```

---

## 🔧 **Troubleshooting**

### Common Issues:

**Issue**: Image not loading
**Solution**: 
- Check file permissions: `chmod 644 taufiq-ahamed-emon.jpg`
- Verify path: `/images/advisors/taufiq-ahamed-emon.jpg`

**Issue**: Content not updating
**Solution**:
- Clear browser cache
- Check if build completed: `npm run build`
- Restart web server

**Issue**: Layout broken
**Solution**:
- Verify JSON syntax in advisors array
- Check for missing commas or brackets
- Restore from backup if needed

---

## 🔙 **Rollback Procedure**

### If Issues Occur:
1. **Stop web server**: `sudo systemctl stop nginx`
2. **Restore backup**: `cp InvestorRelationsPage.js.backup.YYYYMMDD InvestorRelationsPage.js`
3. **Remove new image**: `rm taufiq-ahamed-emon.jpg`
4. **Rebuild**: `npm run build`
5. **Restart server**: `sudo systemctl start nginx`

### Rollback Verification:
- Confirm original 3 advisors display
- Verify no broken images or content
- Test page functionality

---

## 📞 **Support Contacts**

### Technical Issues:
- **Development Team**: [Contact Information]
- **Server Admin**: [Contact Information]
- **Emergency**: [Emergency Contact]

### Business Approval:
- **Content Review**: [Content Manager]
- **Final Approval**: [Project Manager]

---

## 📊 **Success Metrics**

### Deployment Success Indicators:
- [ ] Zero deployment errors
- [ ] Page load time < 3 seconds
- [ ] All images loading correctly
- [ ] Mobile/desktop compatibility maintained
- [ ] SEO ranking maintained

### Business Success Indicators:
- [ ] Strategic Advisor section updated as requested
- [ ] Professional presentation maintained
- [ ] Stakeholder approval received

---

## 📝 **Deployment Log**

**Deployment Date**: ___________
**Deployed By**: ___________
**Deployment Method**: ___________
**Issues Encountered**: ___________
**Resolution**: ___________
**Sign-off**: ___________

---

*This documentation should be kept with deployment records and updated for future reference.*