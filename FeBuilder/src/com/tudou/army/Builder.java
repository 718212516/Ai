package com.tudou.army;

import java.util.*;
import java.io.*;

public class Builder {
	public static String SVNͷ = "\n * @url $URL$\n" +
			 " * @modified $Author$\n" +
			 " * @version $Rev$\n";
	public static String Ĭ��ͷע�� = "/**" + SVNͷ + " */\n";
	public static HashSet<String> ȫ��ģ��;
	
	public static void main(String[] args) {
		//1.css��·����2.js��·����3.Ŀ���ļ���4...ȫ��ģ��ID
		ȫ��ģ�� = new HashSet<String>();
		for (int i = 3; i < args.length; i++) {
			ȫ��ģ��.add(args[i]);
		}
		File Ŀ���ļ� = new File(args[2]);
		File css��·�� = new File(args[0]);
		File js��·�� = new File(args[1]);
		if(!css��·��.exists()) {
			System.err.println("css��·��������");
			return;
		}
		if(!css��·��.isDirectory()) {
			System.err.println("css��·������Ŀ¼");
			return;
		}
		if(!js��·��.exists()) {
			System.err.println("js��·��������");
			return;
		}
		if(!js��·��.isDirectory()) {
			System.err.println("js��·������Ŀ¼");
			return;
		}
		�����ļ�(css��·��, js��·��, Ŀ���ļ�);
	}
	static void �����ļ�(File css��·��, File js��·��, File Ŀ���ļ�) {
		if(!Ŀ���ļ�.exists()) {
			System.err.println(Ŀ���ļ�.getAbsolutePath() + "�ļ�������");
			return;
		}
		if(Ŀ���ļ�.isDirectory()) {
			File[] list = Ŀ���ļ�.listFiles();
			for(File f : list) {
				�����ļ�(css��·��, js��·��, f);
			}
			return;
		}
		if(!Ŀ���ļ�.isFile() || Ŀ���ļ�.isHidden()) {
			return;
		}
		String name = Ŀ���ļ�.getName();
		if(name.endsWith("_src.css")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
			CssBuilder cssBuilder = new CssBuilder(css��·��, Ŀ���ļ�);
			cssBuilder.����();
		}
		else if(name.endsWith("_src.js")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
			JsBuilder jsBuilder = new JsBuilder(js��·��, Ŀ���ļ�, ȫ��ģ��);
			jsBuilder.����();
		}
		else if(name.endsWith(".css") || name.endsWith(".js")) {
			Ϊ�ļ����Ĭ��ͷע��(Ŀ���ļ�);
		}
	}
	static void Ϊ�ļ����Ĭ��ͷע��(File Ŀ���ļ�) {
		BufferedReader br = null;
		String s = null;
		try {
			br = new BufferedReader(new FileReader(Ŀ���ļ�));
			StringBuilder sb = new StringBuilder();
			while((s = br.readLine()) != null) {
				sb.append(s);
				sb.append("\n");
			}
			s = sb.toString();
			if(!s.startsWith("/**")) {
				BufferedWriter bw = null;
				try {
					bw = new BufferedWriter(new FileWriter(Ŀ���ļ�));
					bw.write(Ĭ��ͷע��);
					bw.write(s);
					bw.close();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					if(bw != null) {
						try {
							bw.close();
						} catch (IOException e) {
							//
						}
					}
				}
			}
		} catch(IOException e) {
			e.printStackTrace();
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

}
