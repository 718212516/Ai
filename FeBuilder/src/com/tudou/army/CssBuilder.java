package com.tudou.army;

import java.io.*;
import java.util.*;
import java.util.regex.*;

import com.google.javascript.jscomp.CommandLineRunner;
import com.yahoo.platform.yui.compressor.YUICompressor;

public class CssBuilder {
	private File ��·��;
	private File Ŀ���ļ�;
	private File �ϲ��ļ�;
	private LinkedHashSet<File> �ļ��б�;
	private Boolean �Ƿ�ѹ��;
	private File ѹ���ļ�;
	
	public CssBuilder(File ��·��, File Ŀ���ļ�, Boolean �Ƿ�ѹ��) {
		this.��·�� = ��·��;
		this.Ŀ���ļ� = Ŀ���ļ�;
		this.�Ƿ�ѹ�� = �Ƿ�ѹ��;
		�Ƿ�ѹ�� = false;
		String name = Ŀ���ļ�.getName();
		�ϲ��ļ� = new File(Ŀ���ļ�.getParent(), name.substring(0, name.length() - 8) + ".css");
		ѹ���ļ� = new File(Ŀ���ļ�.getParent(), name.substring(0, name.length() - 8) + ".min.css");
		if(!�ϲ��ļ�.exists()) {
			try {
				�ϲ��ļ�.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
				System.exit(1);
			}
		}
		�ļ��б� = new LinkedHashSet<File>();
	}
	public void ����() {
		StringBuilder ������� = new StringBuilder();
		�ݹ鵼���ļ�(Ŀ���ļ�, �������);
		System.out.println("---Input:");
		for(File f : �ļ��б�) {
			System.out.println(f);
		}
		���(�������);
		System.out.println("---Output:");
		System.out.println(�ϲ��ļ�);
	}
	private void �ݹ鵼���ļ�(File ��ǰ�ļ�, StringBuilder �������) {
		if(�ļ��б�.contains(��ǰ�ļ�)) {
			System.err.println("���ظ�������ļ���" + ��ǰ�ļ�);
			return;
		}
		BufferedReader br = null;
		String s = null;
		try {
			br = new BufferedReader(new FileReader(��ǰ�ļ�));
			while((s = br.readLine()) != null) {
				Pattern p = Pattern.compile("\\s*@import\\s+url\\((.+)\\)\\s*;");
				Matcher m = p.matcher(s);
				//��@import�ⲿcss
				if(m.find()) {
					s = m.group(1);
					if(s.charAt(0) == '/') {
						�ݹ鵼���ļ�(new File(��·��, s), �������);
					}
					else {
						�ݹ鵼���ļ�(new File(��ǰ�ļ�.getParent(), s), �������);
					}
				}
				else {
					if(��ǰ�ļ� != Ŀ���ļ�) {
						//�������ļ���ͷ��Ϣ��svn�Զ��汾���滻��
						if(s.startsWith(" * @")) {
							s = s.replaceAll(" \\$", " ");
						}
						//���������ͼƬ��ַ��������
						else {
							Pattern p2 = Pattern.compile("url\\s*\\(\\s*([\"']?)(\\S+)\\1\\s*\\)");
							Matcher m2 = p2.matcher(s);
							while(m2.find()) {
								String s2 = m2.group(2);
								if(s2.startsWith("/") == false) {
									File f = new File(��ǰ�ļ�.getParent(), s2);
									s = s.replace(s2, "/community" + f.getAbsolutePath().replace(��·��.getAbsolutePath(), "").replace(File.separator, "/").replaceAll("\\w+/\\.\\./", "").replace("./", ""));
								}
							}
						}
					}
					�������.append(s);
					�������.append("\n");
				}
			}
			br.close();
			�ļ��б�.add(��ǰ�ļ�);
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		} finally {
			if(br != null) {
				try {
					br.close();
				} catch(IOException e) {
					//
				}
			}
		}
	}
	private void ���(StringBuilder �������) {
		BufferedWriter bw = null;
		try {
			bw = new BufferedWriter(new FileWriter(�ϲ��ļ�));
			bw.write(�������.toString());
			bw.close();
		} catch (IOException e) {
			e.printStackTrace();
			System.exit(1);
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch(IOException e) {
					//
				}
			}
		}
		if(�Ƿ�ѹ��) {
			String[] args = new String[3]; 
			args[0] = �ϲ��ļ�.getAbsolutePath();
			args[1] = "-o";
			args[2] = ѹ���ļ�.getAbsolutePath();
			YUICompressor.parse(args);
		}
	}
	public static void ѹ��(File �ļ�) {
		String �ļ��� = �ļ�.getName();
		File �ϲ��ļ� = �ļ�;
		File ѹ���ļ� = null;
		if(�ļ���.endsWith("_src.css")) {
			�ϲ��ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 8) + ".css");
			if(�ϲ��ļ�.exists()) {
				ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 8) + ".min.css");
			}
			else {
				�ϲ��ļ� = �ļ�;
				ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 8) + ".min.css");
			}
		}
		else {
			ѹ���ļ� = new File(�ļ�.getParent(), �ļ���.substring(0, �ļ���.length() - 3) + ".min.css");
		}
		System.out.println("---Compress:");
		System.out.println(ѹ���ļ�);
		String[] args = new String[3]; 
		args[0] = �ϲ��ļ�.getAbsolutePath();
		args[1] = "-o";
		args[2] = ѹ���ļ�.getAbsolutePath();
		YUICompressor.parse(args);
	}
}
