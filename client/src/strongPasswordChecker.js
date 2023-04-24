function strongPasswordChecker(pw, minLength = 6, maxLength = 20, maxRepeat = 2) {
    const re = new RegExp(`(.)\\1{0,${maxRepeat}}(?=\\1{${maxRepeat}})`, 'g');
    const changes = (pw.match(re) || []).map(s => s.length).sort((a, b) => b - a);
  
    let toRemove = pw.length - maxLength;
    while (changes.at(-1) <= toRemove) {
        toRemove -= changes.pop();
    }
  
    const numChanges = Math.max(
        changes.length, !/[a-z]/.test(pw) + !/[A-Z]/.test(pw) + !/[0-9]/.test(pw));
    return Math.max(minLength - pw.length, numChanges + Math.max(0, pw.length - maxLength)).toString();
  };


export default strongPasswordChecker;