class StrLenInferIssue {
    public int test(String str) throws Exception
    {
        return str.length();
    }
}

class Program {
    public static void main(String[] args) throws Exception {
        new TestClass().testMethod();
    }
}