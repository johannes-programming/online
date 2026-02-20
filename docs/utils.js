export function addBody() {
    if (!document.body) {
        const body = document.createElement('body');
        document.documentElement.appendChild(body);
    } 
}
export function toSubdomain(pkg) {
    let ans = pkg.replace("_", "-");
    ans = ans.toLowerCase();
    return ans;
}