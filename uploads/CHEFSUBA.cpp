#include<bits/stdc++.h>
using namespace std;

int count_ones(int a[],int n,int i,int k){
    int ct=0;
    for (int j = i; j < i+k; ++j)
    {
        if (a[j]==1)
        {
            ct++;
        }
    }
    return ct;
}
int main(){
    int n,k,p,i;
    scanf("%d",&n);
    scanf("%d",&k);
    scanf("%d",&p);
    int *a = new int[n];
    for (i = 0; i < n; ++i)
    {
        scanf("%d",&a[i]);
    }
    char *c = new char[p];
    for (i = 0; i < p; ++i)
    {
        scanf("%c",&c[i]);
    }
    for (i = 0; i < p; ++i)
    {
        if(c[i]=='?'){
            int max=0;
            for(int j=0;j<n-k+1;j++){
                if(max<count_ones(a,n,j,k))
                    max=count_ones(a,n,j,k);
            }
            cout<<max<<endl;
        }
        else{
            int temp=a[n-1];
            for (int j = 0; j <n-1; ++j)
            {
                a[j+1]=a[j];
            }
            a[0]=temp;
        }
    }
}